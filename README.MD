# Zee's E-Commerce App 

A full-stack e-commerce web application built with **Node.js**, **Express**, **MongoDB**, and **AWS S3** for product storage. Designed to run both locally and on **Docker/EC2**, with environment-specific configuration.

---

## Features

- Browse and view products
- Upload product images to AWS S3
- JWT-based authentication
- MongoDB database integration
- Seed script to populate products
- Runs locally or in Docker containers

---

## Tech Stack

- **Backend:** Node.js, Express  
- **Database:** MongoDB  
- **File Storage:** AWS S3  
- **Containerization:** Docker  
- **Dev Tools:** dotenv, multer, multer-s3  

---

## Getting Started

### Prerequisites

- Node.js >= 18  
- MongoDB (local or Docker)  
- AWS account with S3 bucket  
- Docker (for containerized deployment)  

---

### 1️⃣ Local Development

1. Clone the repository:

```bash
git clone <your-repo-url>
cd zees-ecommerce-app
Install dependencies:

bash
Copy code
npm ci
Create a .env.local file in the project root:

env
Copy code
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/zeesdb
JWT_SECRET=sup3rS3cr3tT0kenKey123!

AWS_ACCESS_KEY_ID=YOUR_LOCAL_AWS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_LOCAL_AWS_SECRET
AWS_REGION=us-east-1
AWS_BUCKET_NAME=dillishwaggins-zees-app-bucket
Seed the database:

bash
Copy code
npm run seed:local
Start the app:

bash
Copy code
npm run dev
Open your browser at http://localhost:5000

---

### 2️⃣ Docker / EC2 Deployment
Make sure your .env.docker exists in the project root:

env
Copy code
PORT=5000
MONGO_URI=mongodb://zees-mongo:27017/zeesdb
JWT_SECRET=sup3rS3cr3tT0kenKey123!

AWS_ACCESS_KEY_ID=YOUR_AWS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET
AWS_REGION=us-east-1
AWS_BUCKET_NAME=dillishwaggins-zees-app-bucket
Build the Docker image:

bash
Copy code
docker build -t zees-app:latest .
Run the Docker container:

bash
Copy code
docker run -d \
  --name zees-app \
  -p 5000:5000 \
  --env-file .env.docker \
  zees-app:latest
Seed the database inside Docker:

bash
Copy code
docker exec -it zees-app sh
node src/seed.js
exit
Visit your EC2 public IP:

cpp
Copy code
http://<EC2_PUBLIC_IP>:5000

---

### 3️⃣ Environment Management
.env.local → Local development

.env.docker → Docker/EC2 deployment

Keep .env* files in .gitignore to protect sensitive keys.

---

### 4️⃣ Troubleshooting
Cannot find module 'multer' → Ensure npm ci is run before building Docker images.

getaddrinfo ENOTFOUND zees-mongo → Use correct MongoDB URI for local vs Docker.

Products not showing → Re-run the seed script for your environment.

---

### 5️⃣ Project Structure
php
Copy code
zees-ecommerce-app/
│
├─ src/
│   ├─ routes/       # API routes
│   ├─ utils/        # AWS S3 and other helpers
│   ├─ seed.js       # Script to seed MongoDB
│   └─ app.js        # Entry point
│
├─ public/           # Static assets
├─ node_modules/
├─ package.json
├─ Dockerfile
├─ docker-compose.yml
├─ .env.local
├─ .env.docker
└─ README.md
---

### 6️⃣ Authors / Contributors
Joy Zawadi – Lead Developer & Designer
---
### 7️⃣ License
MIT License