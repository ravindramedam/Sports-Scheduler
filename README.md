# Sports Scheduler

This is my capstone project of Full Stack Web Development, as part of it, I developed a full stack web application called **Sports Scheduler** using express.js node.js and postgresql. This application allows administrators(Admin) to create and manage sports and participants to create and join sports sessions instantly.

## Features

- **Administrator Functions:**
  - Create and manage sports.
  - View reports and manage sessions.

- **Participant Functions:**
  - Create and join sports sessions.
  - View upcoming and past sessions.

## 🛠️ Technology Stack

### 🌐 Frontend
- **EJS** – Templating engine used to render dynamic HTML pages.

### 🔧 Backend
- **Node.js** – JavaScript runtime environment.  
- **Express.js** – Web framework for Node.js.

### 🗄️ Database
- **PostgreSQL** – Relational database management system.  
- **Sequelize** – Promise-based ORM for Node.js and PostgreSQL.

### 🔐 Authentication
- **Passport.js** – Middleware for authentication.  
- **passport-local** – Strategy for username/password authentication.  
- **bcrypt** – Library for hashing passwords securely.

### 📦 Other Dependencies
- **express-session** – Session management.  
- **connect-flash** – Flash messages.  
- **cookie-parser** – Parse cookies.  
- **tiny-csrf** – CSRF protection middleware.  
- **connect-ensure-login** – Middleware to ensure user is logged in.

### 🧪 Testing & Dev Tools
- **Jest** – JavaScript testing framework.  
- **Supertest** – HTTP assertions for testing Express apps.  
- **Cheerio** – jQuery-like HTML parsing for testing views.  
- **Nodemon** – Automatically restarts the server during development.  
- **ESLint & Prettier** – Linting and code formatting tools.  
- **Husky & lint-staged** – Git hooks to enforce code quality.

## Screenshots

![Index of Sports Scheduler](https://drive.google.com/uc?export=view&id=1FIDOh4S0zYX_aA6G2YKSuP_l03pgyZZn)
![Signup Page](https://drive.google.com/uc?export=view&id=10XgAL6sbVEy9aU1dqjTlQ5uXcEY0Vv9D)
![Homepage of Sports Scheduler](https://drive.google.com/uc?export=view&id=1v2u8ir0ZlZ2RMtUtDNshqL0Q0ohP-UQa)
![Creating a new Sport](https://drive.google.com/uc?export=view&id=1oJ9UATZmfkI96SeE2p5GVPcSqleIzF60)
![Create a Session](https://drive.google.com/uc?export=view&id=1Iv0z1yR7pkbm6vm473ZR1N-romuBuSif)
![Session Details](https://drive.google.com/uc?export=view&id=1FcUbXBSY56jzDeKnA_Xvh_x-d9YI_Y7H)


## Installation and Setup.

To run this application locally, follow these steps:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/ravindramedam/Sports-Scheduler.git
   cd Sports-Scheduler

2. **My project live demo:**
   ```bash
   https://sports-scheduler-ravi.onrender.com/
