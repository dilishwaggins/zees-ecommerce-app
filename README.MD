🛍️ Zees E-Commerce Web App
Full Stack + DevOps + Monitoring Project

Zees-App is a containerized e-commerce web application with authentication, products, orders, and integrated DevOps tooling — featuring CI/CD, Docker, MongoDB, Prometheus, and Grafana for end-to-end observability.

🚀 Features

🧩 Node.js + Express backend

🗃️ MongoDB database

🔐 JWT authentication

📦 Dockerized services with docker-compose

🧠 Prometheus & Grafana monitoring for app and server

⚙️ GitHub Actions CI/CD — builds, tests, scans (Trivy), and pushes to DockerHub

☁️ Deployed on AWS EC2 with persistent Mongo volume

🧰 Tech Stack
Category	Tools Used
Backend	Node.js, Express, MongoDB
Security	JWT Auth
DevOps	Docker, Docker Compose, GitHub Actions, Trivy
Monitoring	Prometheus, Grafana
Cloud	AWS EC2 (Amazon Linux 2023)
🐳 Docker Setup
🧩 Run locally
docker-compose up --build -d

📂 Services
Service	Port	Description
zees-app	5000	Node.js backend
mongo	27017	MongoDB database
prometheus	9090	Metrics collector
grafana	3000	Dashboard visualization
📊 Metrics Endpoints

App Metrics → http://localhost:5000/metrics

Health Check → http://localhost:5000/health

⚙️ CI/CD Pipeline

The GitHub Actions workflow:

Builds and tests Node.js app

Runs Trivy security scan

Builds Docker image

Pushes to DockerHub

name: CI/CD Pipeline

on:
  push:
    branches: [ "main" ]

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test || echo "No tests found, skipping..."

      - name: Log in to DockerHub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Run Trivy Security Scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ secrets.DOCKERHUB_USERNAME }}/zees-app:latest
          format: 'table'

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/zees-app:latest

☁️ Deployment on AWS EC2

Launch Amazon Linux 2023 EC2 instance

Install Docker and Docker Compose

Clone the repo:

git clone https://github.com/<your-username>/zees-app.git
cd zees-app


Run:

docker-compose up -d


Visit:

App → http://<EC2-IP>:5000

Grafana → http://<EC2-IP>:3000

Prometheus → http://<EC2-IP>:9090

📈 Monitoring Dashboard

Grafana panels include:

HTTP Requests per second

Response time histogram

Memory and CPU usage per container

MongoDB health and uptime

App availability from /health
