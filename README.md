# 🏆 Sports Scheduler

This is my **Capstone Project** for the **Full Stack Web Development program**.  
I developed a full stack web application called **Sports Scheduler** using **Node.js, Express.js, and PostgreSQL**.

The application allows **Administrators** to create and manage sports while **Participants** can instantly create and join sports sessions.

---

## 🚀 Live Demo

You can view the deployed project here:

https://sports-scheduler-ravi.onrender.com/

---

## 📌 Project Overview

Managing sports activities manually can be difficult when multiple sports and participants are involved.  
**Sports Scheduler** provides a simple and centralized platform where:

- Administrators manage sports activities.
- Participants create and join sports sessions.
- Users track upcoming and past sports sessions.

This system helps organize sports sessions efficiently with **secure authentication and database management**.

---

## ✨ Features

### 👨‍💼 Administrator Functions
- Create and manage sports.
- View reports of sports sessions.
- Manage and monitor sessions.

### 👤 Participant Functions
- Create sports sessions.
- Join available sports sessions.
- View upcoming sessions.
- Track past sessions.

---

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

### 🧪 Testing & Development Tools
- **Jest** – JavaScript testing framework.
- **Supertest** – HTTP assertions for testing Express apps.
- **Cheerio** – jQuery-like HTML parsing for testing views.
- **Nodemon** – Automatically restarts the server during development.
- **ESLint & Prettier** – Linting and code formatting tools.
- **Husky & lint-staged** – Git hooks to enforce code quality.

---

## 📸 Application Screenshots

### Index of Sports Scheduler
![Index of Sports Scheduler](https://drive.google.com/uc?export=view&id=1FIDOh4S0zYX_aA6G2YKSuP_l03pgyZZn)

### Signup Page
![Signup Page](https://drive.google.com/uc?export=view&id=10XgAL6sbVEy9aU1dqjTlQ5uXcEY0Vv9D)

### Homepage of Sports Scheduler
![Homepage](https://drive.google.com/uc?export=view&id=1v2u8ir0ZlZ2RMtUtDNshqL0Q0ohP-UQa)

### Creating a New Sport
![Create Sport](https://drive.google.com/uc?export=view&id=1oJ9UATZmfkI96SeE2p5GVPcSqleIzF60)

### Create a Session
![Create Session](https://drive.google.com/uc?export=view&id=1Iv0z1yR7pkbm6vm473ZR1N-romuBuSif)

### Session Details
![Session Details](https://drive.google.com/uc?export=view&id=1FcUbXBSY56jzDeKnA_Xvh_x-d9YI_Y7H)

---

## 📂 Project Structure

```
Sports-Scheduler
│
├── app.js
├── models
├── controllers
├── routes
├── views
├── migrations
├── public
└── tests
```

---

## ⚙️ Installation and Setup

To run this application locally, follow these steps:

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/ravindramedam/Sports-Scheduler.git
cd Sports-Scheduler
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Database

Create a PostgreSQL database and configure the **.env file** with your database credentials.

Example:

```
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=sports_scheduler
DB_HOST=localhost
```

### 4️⃣ Run Database Migrations

```bash
npx sequelize-cli db:migrate
```

### 5️⃣ Start the Application

```bash
npm start
```

Now open the browser and visit:

```
http://localhost:3000
```

---

## 🧠 What I Learned

Through this project, I gained practical experience in:

- Building full stack applications using **Node.js and Express.js**
- Designing backend architecture using **MVC pattern**
- Implementing **authentication using Passport.js**
- Managing relational databases with **PostgreSQL and Sequelize**
- Writing automated tests using **Jest and Supertest**
- Implementing **security practices like CSRF protection and password hashing**

---

## 👨‍💻 Author

**Medam Venkata Ravindra Reddy**

📧 Email: ravindramedam321@gmail.com  
🔗 LinkedIn: https://www.linkedin.com/in/ravindramedam

---

## ⭐ Support

If you like this project, please consider giving it a ⭐ on GitHub.
