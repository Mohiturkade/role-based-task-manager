# Role-Based Task Manager

A full-stack Role-Based Task Management application built with React.js, Node.js, Express.js, MongoDB, and JWT Authentication.

## Features

### Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes

### User Features

* Create Tasks
* View Own Tasks
* Update Own Tasks
* Delete Own Tasks

### Admin Features

* View All Users
* Manage User Status (Active/Inactive)
* View All Tasks
* Delete Any Task
* Activity Monitoring Dashboard

### Activity Logs

* User Login Tracking
* Task Creation Tracking
* Task Update Tracking
* Task Deletion Tracking

### Analytics Dashboard

* Total Users
* Total Tasks
* Completed Tasks
* Pending Tasks

## Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs

## Project Structure

role-based-task-manager/

├── backend/

│ ├── controllers/

│ ├── middleware/

│ ├── models/

│ ├── routes/

│ └── server.js

│

├── frontend/

│ ├── src/

│ ├── components/

│ ├── pages/

│ ├── services/

│ └── App.jsx

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd role-based-task-manager
```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
PORT=7001
CONNECTION_STRING=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run Backend

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Demo Admin Credentials

Email: [admin@example.com](mailto:admin@example.com)

Password: Admin@7387

## API Endpoints

### Authentication

* POST /api/auth/register
* POST /api/auth/login
* GET /api/auth/me

### Tasks

* POST /api/tasks
* GET /api/tasks
* PUT /api/tasks/:id
* DELETE /api/tasks/:id

### Admin

* GET /api/admin/users
* PATCH /api/admin/users/:id/status
* DELETE /api/admin/users/:id
* GET /api/admin/tasks
* GET /api/admin/stats

## Assignment Requirements Covered

* Role-Based Authentication
* Admin Dashboard
* User Dashboard
* Activity Tracking
* Protected Routes
* Admin Route Protection
* Analytics Section
* Responsive UI
* MongoDB Integration
* REST APIs

## Author

Mohit Urkade
