# Backlog — Product Feedback & Development Tracking Platform

> **B.Tech Flexi Credit Course — Final Project**
> Repository: `25070521237-CA-03`

---

## Table of Contents

1. [Project Description](#1-project-description)
2. [Problem Statement & Objectives](#2-problem-statement--objectives)
3. [Technology Stack](#3-technology-stack)
4. [Features & User Roles](#4-features--user-roles)
5. [Application Pages](#5-application-pages)
6. [Project Folder Structure](#6-project-folder-structure)
7. [Architecture Overview](#7-architecture-overview)
8. [Database Collections](#8-database-collections)
9. [Prerequisites](#9-prerequisites)
10. [Installation & Setup](#10-installation--setup)
11. [Environment Configuration](#11-environment-configuration)
12. [Starting MongoDB Locally](#12-starting-mongodb-locally)
13. [Connecting MongoDB Compass](#13-connecting-mongodb-compass)
14. [Running the Application](#14-running-the-application)
15. [Seeding the Database](#15-seeding-the-database)
16. [Demo Credentials](#16-demo-credentials)
17. [API Endpoint Reference](#17-api-endpoint-reference)
18. [How Key Features Work](#18-how-key-features-work)
19. [Common Errors & Troubleshooting](#19-common-errors--troubleshooting)
20. [Viva Q&A Reference](#20-viva-qa-reference)

---

## 1. Project Description

**Backlog** is a full-stack product feedback and development tracking web application. It allows software product teams to:

- Collect and organize user feedback and feature requests.
- Let users vote on features they care about most.
- Track bugs with severity and resolution status.
- Publish a public roadmap showing planned, in-progress, and completed work.
- Share release notes and changelogs with users.
- Allow team administrators to manage all content and update statuses.

The name **Backlog** comes from the software development practice of maintaining a prioritized list (backlog) of features and improvements to be worked on.

---

## 2. Problem Statement & Objectives

### Problem
Software teams often struggle to collect structured feedback, prioritize features, track bugs, and communicate progress — all in one place. Tools like Jira are overly complex; simple forms lose track of user input.

### Objectives
- Build a real full-stack web application using the MERN stack (MongoDB, Express, React, Node.js).
- Implement user authentication with JWT and role-based access control.
- Demonstrate complete CRUD operations with a real database.
- Create a polished, professional UI that works on desktop and mobile.
- Show the full data lifecycle: frontend form → REST API → MongoDB storage → displayed back to user.

---

## 3. Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React.js 18 + Vite | UI components and routing |
| Styling | Plain CSS with CSS variables | Consistent design system |
| Icons | Lucide React | Clean, consistent icons |
| HTTP Client | Axios | API communication |
| Routing | React Router v6 | Client-side navigation |
| Backend | Node.js + Express.js | REST API server |
| Database | MongoDB (local) | Data persistence |
| ODM | Mongoose | MongoDB schema and queries |
| Authentication | JWT (jsonwebtoken) | Token-based auth |
| Password Security | bcryptjs | Secure password hashing |
| Database GUI | MongoDB Compass | Inspect and manage database |
| Dev Server | Nodemon | Auto-restart on changes |

---

## 4. Features & User Roles

### Regular Users Can:
- Register and log in securely.
- Browse, search, filter, and sort feedback submissions.
- Submit new feature requests and feedback.
- Vote on feedback (one vote per user, toggleable).
- Comment on feedback submissions.
- Report bugs with severity and description.
- Edit and delete their own submissions.
- Save feedback and bugs for quick reference.
- View the public roadmap.
- View the changelog/release history.
- Manage their profile.

### Administrators Can:
- Do everything regular users can.
- Update the status of any feedback item (Planned, In Progress, Completed, etc.).
- Update the status of any bug report.
- Create, edit, and delete changelog entries.
- Access the Admin Studio with platform statistics.
- View all user activity.

---

## 5. Application Pages

| Route | Page | Access |
|-------|------|--------|
| `/login` | Login | Public |
| `/signup` | Registration | Public |
| `/dashboard` | Home Dashboard | Authenticated |
| `/feedback` | Feedback Board | Authenticated |
| `/feedback/new` | Submit Feedback | Authenticated |
| `/feedback/:id` | Feedback Details | Authenticated |
| `/roadmap` | Product Roadmap | Authenticated |
| `/changelog` | Release Changelog | Authenticated |
| `/bugs` | Bug Tracker | Authenticated |
| `/saved` | Saved Items | Authenticated |
| `/profile` | My Profile | Authenticated |
| `/admin` | Admin Studio | Admin Only |

---

## 6. Project Folder Structure

```
25070521237-CA-03/
│
├── client/                         # React frontend
│   ├── public/                     # Static assets
│   ├── src/
│   │   ├── assets/                 # Images, icons
│   │   ├── components/             # Reusable UI components
│   │   │   ├── BugCard.jsx
│   │   │   ├── CommentSection.jsx
│   │   │   ├── ConfirmModal.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── FeedbackCard.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── SkeletonCard.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── VoteButton.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Authentication state
│   │   │   └── ToastContext.jsx    # Notification state
│   │   ├── layouts/
│   │   │   ├── AuthLayout.jsx      # Login/signup layout
│   │   │   └── DashboardLayout.jsx # Main app layout
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── FeedbackBoard.jsx
│   │   │   ├── SubmitFeedback.jsx
│   │   │   ├── FeedbackDetail.jsx
│   │   │   ├── Roadmap.jsx
│   │   │   ├── Changelog.jsx
│   │   │   ├── BugTracker.jsx
│   │   │   ├── SavedItems.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── AdminStudio.jsx
│   │   │   └── NotFound.jsx
│   │   ├── services/
│   │   │   └── api.js              # All API call functions
│   │   ├── styles/
│   │   │   └── global.css          # Global design system
│   │   ├── App.jsx                 # Router and route definitions
│   │   └── main.jsx                # React entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                         # Node.js + Express backend
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── feedbackController.js
│   │   ├── bugController.js
│   │   ├── changelogController.js
│   │   ├── savedController.js
│   │   ├── dashboardController.js
│   │   ├── userController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── auth.js                 # JWT protect + adminOnly
│   ├── models/
│   │   ├── User.js
│   │   ├── Feedback.js
│   │   ├── Comment.js
│   │   ├── BugReport.js
│   │   ├── Changelog.js
│   │   └── SavedItem.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── feedback.js
│   │   ├── bugs.js
│   │   ├── changelog.js
│   │   ├── saved.js
│   │   ├── dashboard.js
│   │   ├── users.js
│   │   ├── admin.js
│   │   └── roadmap.js
│   ├── scripts/
│   │   └── seed.js                 # Database seeder
│   ├── .env.example
│   ├── package.json
│   └── server.js                   # Express app entry point
│
├── .gitignore
└── README.md
```

---

## 7. Architecture Overview

```
Browser (React + Vite)
       |
       | HTTP/HTTPS (Axios)
       |
Express.js REST API (Node.js)
       |
       | Mongoose ODM
       |
  MongoDB (local, port 27017)
```

### How a typical request flows:
1. **User action** on the React frontend (e.g., clicks "Vote").
2. **Axios** sends a `POST /api/feedback/:id/vote` request with the JWT token in the Authorization header.
3. **Express** receives the request, runs the `protect` middleware which verifies the JWT.
4. **Controller** handles business logic (toggle vote, update voteCount).
5. **Mongoose** queries MongoDB and saves the change.
6. **Controller** returns a JSON response.
7. **React** receives the response and updates the UI.

---

## 8. Database Collections

### `users`
Stores registered user accounts.
- `name`, `email`, `password` (hashed), `role` ('user' or 'admin'), `bio`, `createdAt`

### `feedbacks`
Stores feature requests and feedback submissions.
- `title`, `description`, `category`, `status`, `author` (User ref), `votes` (array of User refs), `voteCount`, `tags`, `createdAt`

### `comments`
Stores comments on feedback items.
- `feedback` (Feedback ref), `text`, `author` (User ref), `createdAt`

### `bugreports`
Stores bug reports.
- `title`, `description`, `severity`, `status`, `reporter` (User ref), `stepsToReproduce`, `environment`, `createdAt`

### `changelogs`
Stores release notes and version history.
- `version`, `title`, `summary`, `details`, `releaseDate`, `category`, `author` (User ref)

### `saveditems`
Tracks items saved by users.
- `user` (User ref), `itemId`, `itemType` ('feedback' or 'bug'), `createdAt`
- Unique compound index on `[user, itemId, itemType]` prevents duplicates.

---

## 9. Prerequisites

Before running Backlog, ensure you have the following installed:

| Software | Version | Download |
|---------|---------|----------|
| Node.js | v18 or higher | https://nodejs.org |
| npm | v9 or higher (bundled with Node.js) | - |
| MongoDB Community Server | v6 or higher | https://www.mongodb.com/try/download/community |
| MongoDB Compass | Latest | https://www.mongodb.com/try/download/compass |
| Git | Any recent version | https://git-scm.com |

**Install MongoDB Community Server** — this is the actual database server. MongoDB Compass is only the graphical interface; you need both.

---

## 10. Installation & Setup

### Step 1: Clone the repository
```powershell
git clone https://github.com/YOUR_USERNAME/25070521237-CA-03.git
cd 25070521237-CA-03
```

### Step 2: Install backend dependencies
```powershell
cd server
npm install
```

### Step 3: Configure backend environment
```powershell
# In the server directory:
Copy-Item .env.example .env
```
The default values in `.env.example` work for local development. No changes needed unless your MongoDB is on a different port.

### Step 4: Install frontend dependencies
```powershell
cd ../client
npm install
```

### Step 5: Configure frontend environment (optional)
```powershell
# In the client directory:
Copy-Item .env.example .env
```
The default `VITE_API_URL=http://localhost:5000` works with Vite's proxy setup.

---

## 11. Environment Configuration

### server/.env
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/backlog_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

> **Note:** Never commit the `.env` file. It is excluded by `.gitignore`.

---

## 12. Starting MongoDB Locally

MongoDB Community Server must be running before starting the backend.

### On Windows (recommended — run MongoDB as a service):

**Option A: Start MongoDB service** (if installed as a Windows service):
```powershell
net start MongoDB
```

**Option B: Start MongoDB manually**:
```powershell
# Replace with your actual MongoDB installation path
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath="C:\data\db"
```

**Option C: Using MongoDB Shell to verify it's running**:
```powershell
mongosh
# You should see a connection to localhost:27017
```

> MongoDB runs on port **27017** by default. The application connects to `mongodb://127.0.0.1:27017/backlog_db`.

---

## 13. Connecting MongoDB Compass

1. Open **MongoDB Compass**.
2. In the connection field, enter: `mongodb://127.0.0.1:27017`
3. Click **Connect**.
4. After connecting, you will see the `backlog_db` database in the left panel (it appears after the seed script runs or after the first data is inserted).
5. Click on `backlog_db` to expand and see the collections:
   - `users`
   - `feedbacks`
   - `comments`
   - `bugreports`
   - `changelogs`
   - `saveditems`
6. Click on any collection to browse its documents.

---

## 14. Running the Application

You need **two terminal windows** — one for the backend, one for the frontend.

### Terminal 1 — Start the Backend
```powershell
cd server
npm run dev
```
The backend starts on **http://localhost:5000**

You should see:
```
MongoDB connected: 127.0.0.1
Server running on port 5000
```

### Terminal 2 — Start the Frontend
```powershell
cd client
npm run dev
```
The frontend starts on **http://localhost:5173**

Open your browser and go to: **http://localhost:5173**

---

## 15. Seeding the Database

The seed script populates MongoDB with realistic demonstration data.

```powershell
cd server
npm run seed
```

**What the seed script creates:**
- 3 user accounts (1 admin, 2 regular users)
- 14 realistic feedback entries with different statuses and categories
- 12 comments across various feedback items
- 9 bug reports with different severities and statuses
- 6 changelog entries (release v1.9.0 through v2.3.0)

**The seed script is idempotent** — running it multiple times will not create duplicate entries. It uses upsert logic based on stable identifiers.

After seeding, open MongoDB Compass and refresh to see the data in the `backlog_db` collections.

---

## 16. Demo Credentials

> These credentials are for **local demonstration only**. They are not real production accounts.

| Role | Email | Password |
|------|-------|----------|
| **Administrator** | `admin@backlog.dev` | `Admin@1234` |
| **Regular User** | `sarah@example.com` | `User@1234` |
| **Regular User** | `marcus@example.com` | `User@1234` |

---

## 17. API Endpoint Reference

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | None | Register new user |
| POST | `/api/auth/login` | None | Login, receive JWT |
| GET | `/api/auth/me` | Required | Get current user |

### Feedback
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/feedback` | None | List feedback (search, filter, sort) |
| GET | `/api/feedback/:id` | None | Get single feedback |
| POST | `/api/feedback` | Required | Create feedback |
| PUT | `/api/feedback/:id` | Required | Update feedback (own or admin) |
| DELETE | `/api/feedback/:id` | Required | Delete feedback (own or admin) |
| POST | `/api/feedback/:id/vote` | Required | Toggle vote |
| POST | `/api/feedback/:id/comments` | Required | Add comment |
| GET | `/api/feedback/:id/comments` | None | Get comments |

### Bug Reports
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/bugs` | None | List bugs (search, filter) |
| GET | `/api/bugs/:id` | None | Get single bug |
| POST | `/api/bugs` | Required | Report new bug |
| PUT | `/api/bugs/:id` | Required | Update bug (own or admin) |
| DELETE | `/api/bugs/:id` | Required | Delete bug (own or admin) |

### Changelog
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/changelog` | None | List all changelog entries |
| GET | `/api/changelog/:id` | None | Get single entry |
| POST | `/api/changelog` | Admin | Create entry |
| PUT | `/api/changelog/:id` | Admin | Update entry |
| DELETE | `/api/changelog/:id` | Admin | Delete entry |

### Saved Items
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/saved` | Required | Get my saved items |
| POST | `/api/saved/toggle` | Required | Save or unsave an item |
| GET | `/api/saved/check` | Required | Check if item is saved |

### Dashboard
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/dashboard/summary` | Required | Dashboard statistics and lists |

### Roadmap
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/roadmap` | None | Feedback grouped by status |
| PUT | `/api/roadmap/:id/status` | Admin | Update feedback status |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/me` | Required | Get my profile |
| PUT | `/api/users/me` | Required | Update my profile |
| GET | `/api/users/me/activity` | Required | Get my activity |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/stats` | Admin | Platform statistics |
| GET | `/api/admin/users` | Admin | List all users |
| PUT | `/api/admin/feedback/:id/status` | Admin | Update feedback status |
| PUT | `/api/admin/bugs/:id/status` | Admin | Update bug status |

---

## 18. How Key Features Work

### Sign-Up Flow
1. User fills out the registration form (`/signup`).
2. React validates the form client-side (required fields, email format, password length, password match).
3. Axios sends `POST /api/auth/register` with `{ name, email, password }`.
4. Express validates the data server-side and checks for duplicate emails.
5. bcryptjs hashes the password with 12 salt rounds: `bcrypt.hash(password, 12)`.
6. A new User document is saved to MongoDB.
7. The API returns a success message (no token — user must then log in).
8. React shows a success notification and redirects to `/login`.

### Login & JWT Authentication
1. User submits email and password at `/login`.
2. Express finds the user by email (including the password field with `select: '+password'`).
3. `bcrypt.compare(submittedPassword, storedHash)` verifies the password.
4. `jsonwebtoken.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' })` creates the token.
5. The token is returned to the frontend and stored in `localStorage`.
6. Every subsequent API request includes: `Authorization: Bearer <token>` in the header.
7. The `protect` middleware verifies this token on every protected route.

### Protected Routes
- **Frontend**: React Router's `ProtectedRoute` component checks `isAuthenticated` from `AuthContext`. If false, redirects to `/login`.
- **Backend**: The `protect` middleware decodes the JWT and attaches the user to `req.user`. If the token is missing or invalid, it returns `401 Unauthorized`.
- **Admin routes**: The `adminOnly` middleware additionally checks `req.user.role === 'admin'`. If not, returns `403 Forbidden`.

### Feedback Voting (Duplicate Prevention)
The `votes` field on a Feedback document is an array of User ObjectIds.
- When a user votes: check if `req.user._id` exists in `feedback.votes`.
  - If **not present**: add to array, increment `voteCount`.
  - If **already present**: remove from array, decrement `voteCount`.
- This guarantees one vote per user without a separate votes table.

### MongoDB Data Persistence
- Mongoose models define schemas that map to MongoDB collections.
- `mongoose.model('Feedback', feedbackSchema)` creates/uses the `feedbacks` collection.
- All create/update/delete operations use Mongoose methods (`save()`, `findByIdAndUpdate()`, etc.).
- Data survives server restarts because it's stored in MongoDB, not memory.

---

## 19. Common Errors & Troubleshooting

| Error | Cause | Solution |
|-------|-------|---------|
| `ECONNREFUSED 127.0.0.1:27017` | MongoDB not running | Start MongoDB service: `net start MongoDB` |
| `Cannot find module 'express'` | Dependencies not installed | Run `npm install` in `server/` folder |
| `Port 5000 already in use` | Another process using port | Kill it: `netstat -ano \| findstr :5000` then `taskkill /PID <pid> /F` |
| `JsonWebTokenError: invalid signature` | Wrong JWT_SECRET in .env | Ensure .env has correct JWT_SECRET |
| `401 Unauthorized` on API calls | Token missing or expired | Log out and log back in |
| `403 Forbidden` | User is not admin | Log in with the admin account |
| White screen in browser | React build error | Check terminal for errors, check browser console |
| `duplicate key error` on seed | Seed run issue | Script is idempotent — safe to run again |

---

## 20. Viva Q&A Reference

**Q: What is Backlog and what problem does it solve?**
A: Backlog is a product feedback and development tracking platform. It solves the problem of software teams having scattered, unorganized user feedback by centralizing feedback collection, voting, bug tracking, and roadmap communication in one tool.

**Q: Why React, Node.js, Express, and MongoDB?**
A: This is the MERN stack — a popular, JavaScript-based full-stack combination. React provides a component-based interactive UI. Node.js allows JavaScript on the server. Express simplifies routing and middleware. MongoDB's document model fits well with nested/flexible data structures like feedback with votes and comments.

**Q: How are the client and server connected?**
A: The React frontend uses Axios to send HTTP requests to the Express backend on port 5000. The Vite dev server proxies `/api` requests to `http://localhost:5000`, so the frontend can call `/api/feedback` directly.

**Q: What is a REST API endpoint?**
A: It's a URL on the server that accepts HTTP requests (GET, POST, PUT, DELETE) and returns JSON responses. For example, `GET /api/feedback` returns a list of all feedback items as JSON.

**Q: How is a password stored securely?**
A: We never store the plaintext password. When a user registers, we use `bcryptjs` to hash the password with a "salt" (random data added before hashing) using 12 rounds of processing. The resulting hash (a long, unreadable string) is what's stored in MongoDB. On login, we use `bcrypt.compare()` which hashes the submitted password the same way and compares the results.

**Q: How does JWT authentication work?**
A: After login, the server creates a JSON Web Token (JWT) — a signed string containing the user's ID and role. The frontend stores this token and sends it in every API request's Authorization header. The backend `protect` middleware verifies the token's signature using the secret key. If valid, the user identity is trusted without checking the database every time.

**Q: How does feedback voting prevent duplicate votes?**
A: Each Feedback document has a `votes` array containing the ObjectIds of users who voted. When a vote request comes in, the server checks: "Is this user's ID already in the votes array?" If yes, we remove it (toggle off). If no, we add it. MongoDB's `$addToSet` ensures uniqueness.

**Q: How do MongoDB models and collections work?**
A: We define a Mongoose schema (like a blueprint) that describes the shape of data. `mongoose.model('Feedback', schema)` creates a model that maps to the `feedbacks` collection in MongoDB. When we call `model.create(data)`, Mongoose validates the data against the schema and inserts a document into the collection.

**Q: What can an admin do that a regular user cannot?**
A: Admins can update the status of any feedback or bug (not just their own), create/edit/delete changelog entries, and access the Admin Studio page with platform-wide statistics. The server enforces this — even if a user manually requests an admin endpoint, the `adminOnly` middleware checks `req.user.role === 'admin'` and returns 403 if it's not.

**Q: How do I demonstrate the database in MongoDB Compass?**
A: Open Compass, connect to `mongodb://127.0.0.1:27017`, open the `backlog_db` database, and browse the collections. You can see all the seeded feedback, users, bugs, and changelog entries as JSON documents. After creating something in the app, refresh Compass to see the new document appear.

---

*This project was built as a final project for the B.Tech Flexi Credit Course.*
*Repository: `25070521237-CA-03` | Application: Backlog*
