#  Zee's Project - DevOps E-Commerce Web App
> **Tech Stack:** Node.js, MongoDB, Docker, GitHub Actions, Terraform, AWS, Prometheus, Grafana

---

## Week 1 (Aug 5 - Aug 11)

### Goals:
- Setup project folder in VS Code 
- Installed Node.js & Express 
- Created Docker container for MongoDB 
- Connected Express App to MongoDB 
- Planned app structure

### Challenges:
- PowerShell escape characters caused Docker run issues
- First time using Node.js, learning curve with routing and middleware

### Lessons Learned:
- Docker networking for multi-container apps
- Basics of connecting MongoDB to Node.js with Mongoose

### Next Steps:
- Implement product listing & cart routes
- Add frontend templates with EJS or React
- Start writing Dockerfile for the web app

---

## Week 2 (Aug 12 - Aug 18)

### Goals:
- Created `User` model in `models/user.js`
- Added `auth.js` routes: **register**, **login**, **me**
- Implemented JWT authentication with `verifyToken.js` middleware
- Connected routes to `app.js` and tested using VS Code REST Client
- Successfully registered a user, logged in, and accessed a protected route

### Challenges:
- Case sensitivity in `routes` folder caused import errors on Windows
- First time handling password hashing and JWT signing
- Handling 401 errors from invalid/expired tokens

### Lessons Learned:
- Importance of consistent folder/file naming (case-sensitive imports)
- How to hash passwords with bcrypt
- How to create and verify JWT tokens for user sessions

### Next Steps:
- Implement Products model and CRUD routes
- Add Carts and Orders (protected routes)
- Set up token reuse in VS Code REST Client for faster testing
- Begin Dockerizing Node.js app alongside MongoDB
