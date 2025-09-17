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


## Week 3 (Aug 19 - Aug 25)

### Goals:

- Implemented Product model and full CRUD routes (create, read, update, delete)

- Built Cart routes with add/remove items functionality

- Added Order routes with checkout (cart to order + total price calculation)

- Connected frontend (public/index.html + public/app.js) with backend APIs

- Implemented Register, Login, Add to Cart, View Cart, and Checkout buttons in frontend

- Successfully served static frontend with Express and verified API integration

### Challenges:

- Debugging frontend static file serving (express.static and path issues)

- Mismatched ports (5000 for backend vs. 5500 for Live Server in VS Code)

- Handling JWT in frontend fetch headers

- Resolving Cannot GET /index.html and ensuring index loads properly

### Lessons Learned:

- Correct setup for serving static frontend with Express

- Importance of checking browser Network tab for missing/404 assets

- How frontend communicates with backend via fetch and Authorization headers

- Testing full workflow: Register → Login → Add Products → Add to Cart → Checkout

### Next Steps:

- Polish frontend UI (better layout and product listing design)

- Add error handling + user feedback (e.g., login fail, product stock checks)

- Write Dockerfile for Node.js app and test multi-container setup with MongoDB

- Start planning CI/CD with GitHub Actions