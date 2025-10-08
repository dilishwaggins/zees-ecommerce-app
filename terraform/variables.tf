variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "ami_id" {
  description = "Amazon Linux 2 AMI for the region"
  type        = string
  default     = "ami-052064a798f08f0d3"
}

variable "instance_type" {
  description = "Instance type for EC2"
  default     = "t3.micro"
}

variable "key_name" {
  description = "EC2 key pair name for SSH access"
  type        = string
}

variable "dockerhub_username" {
  description = "Your DockerHub username"
  type        = string
}
