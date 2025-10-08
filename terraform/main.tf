
########################################
# Security Group
########################################
resource "aws_security_group" "app_sg" {
  name        = "zees-app-sg"
  description = "Allow inbound traffic for SSH, app, and MongoDB"

  ingress {
    description = "Allow SSH access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow app traffic"
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow MongoDB access (optional - remove in production)"
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "zees-app-sg"
  }
}

########################################
# EC2 Instance
########################################
resource "aws_instance" "app_server" {
  ami                    = var.ami_id
  instance_type          = "t3.micro"
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  user_data = <<-EOF
              #!/bin/bash
              set -e
              yum update -y
              amazon-linux-extras install docker -y || yum install docker -y
              systemctl start docker
              systemctl enable docker
              usermod -aG docker ec2-user

              echo ">>> Starting MongoDB container"
              docker run -d --name mongo -p 27017:27017 mongo:6

              echo ">>> Waiting for MongoDB to initialize"
              sleep 25

              echo ">>> Starting Node.js app container"
              docker run -d --name zees-web -p 5000:5000 \
                -e PORT=5000 \
                -e MONGO_URI=mongodb://mongo:27017/zeesdb \
                -e JWT_SECRET=sup3rS3cr3tT0kenKey123! \
                --link mongo:mongo \
                ${var.dockerhub_username}/zees-app:latest

              echo ">>> Waiting for app container to start"
              sleep 10

              echo ">>> Seeding MongoDB with products"
              docker exec zees-web node src/seed.js || echo "Seeding failed, check logs"

              echo ">>> Deployment complete"
              EOF

  tags = {
    Name = "zees-app-server"
  }
}

########################################
# S3 Bucket
########################################
resource "aws_s3_bucket" "app_bucket" {
  bucket = "dillishwaggins-zees-app-bucket"

  tags = {
    Name        = "zees-app-bucket"
    Environment = "Dev"
  }
}

# Block all public access for security
resource "aws_s3_bucket_public_access_block" "block_public_access" {
  bucket                  = aws_s3_bucket.app_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Enable versioning for backup/history
resource "aws_s3_bucket_versioning" "versioning" {
  bucket = aws_s3_bucket.app_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}

########################################
# Outputs
########################################
output "public_ip" {
  description = "Public IP of the EC2 instance"
  value       = aws_instance.app_server.public_ip
}

output "app_url" {
  description = "URL to access the deployed app"
  value       = "http://${aws_instance.app_server.public_ip}:5000"
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.app_bucket.bucket
}

