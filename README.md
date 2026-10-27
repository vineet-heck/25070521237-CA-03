# Backlog — Product Feedback & Development Tracking Platform

**B.Tech Flexi Credit Course — Final Project**  
**Repository:** `25070521237-CA-03`

## 1. Project Overview

**Backlog** is a full-stack web application that helps users submit product feedback, suggest new features, vote on ideas, report bugs, and track development progress. It also provides a product roadmap, changelog, and administrative tools for managing feedback and bug reports.

The project demonstrates full-stack web development, user authentication, REST API integration, and database operations using the MERN stack.

## 2. Demo Credentials

Use the following accounts to explore the application and test user and administrator features.

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@backlog.dev` | `Admin@1234` |
| **User** | `sarah@example.com` | `User@1234` |
| **User** | `marcus@example.com` | `User@1234` |

*These are demonstration credentials intended for local project evaluation.*

## 3. Key Features

- User registration and login with authentication.
- Feedback submission, browsing, searching, and voting.
- Comments on feedback submissions.
- Bug reporting and status tracking.
- Product roadmap with development statuses.
- Changelog and release history.
- Saved items and user profile management.
- Admin dashboard for managing feedback, bugs, and changelog entries.
- Persistent data storage using MongoDB.

## 4. Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js, Vite, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Database GUI | MongoDB Compass |
| Database ODM | Mongoose |
| Authentication | JWT, bcryptjs |
| API Communication | Axios |
| Version Control | Git and GitHub |

## 5. Installation and Setup

### Prerequisites

Install Node.js, MongoDB Community Server, and MongoDB Compass.

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/25070521237-CA-03.git
cd 25070521237-CA-03
```

Replace `YOUR_USERNAME` with the GitHub repository owner's username.

### Step 2: Configure the Backend

```bash
cd server
npm install
```

Create a `.env` file using `.env.example` and configure the required environment variables. For a local MongoDB installation, the database URI is:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/backlog_db
```

Set the remaining variables according to `.env.example`.

### Step 3: Configure the Frontend

Open a separate terminal from the project root:

```bash
cd client
npm install
```

### Step 4: Populate the Database

Ensure MongoDB is running. In the backend terminal, execute:

```bash
cd server
npm run seed
```

This populates the database with demonstration users and sample application records.

### Step 5: Run the Application

Start the backend from the `server` directory:

```bash
npm run dev
```

Start the frontend in a second terminal from the `client` directory:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

## 6. Database Inspection Using MongoDB Compass

1. Open MongoDB Compass.
2. Connect to `mongodb://127.0.0.1:27017`.
3. Open the `backlog_db` database.
4. Browse the collections containing users, feedback, comments, bug reports, changelog entries, and saved items.
5. Create or update records through the application and inspect the database to verify persistence.

## 7. Conclusion

Backlog demonstrates how a full-stack web application can centralize product feedback, feature prioritization, bug tracking, and development updates through an interactive frontend, REST APIs, authentication, and MongoDB-based data persistence.

**Application:** Backlog  
**Repository:** `25070521237-CA-03`
