# TrackYourJob

> A full-stack job application tracking platform that helps you organize applications, track hiring stages, manage interviews, and document interview experiences.

TrackYourJob is a MERN-based application built to make job searching more organized and manageable. Instead of keeping application details scattered across spreadsheets, notes, and emails, TrackYourJob provides a centralized place to track the complete hiring journey.

---

## 🚀 Features

### 🔐 Authentication

* User registration and login
* Protected application routes
* User-specific application data
* Authentication middleware on protected APIs

---

### 💼 Job Application Management

Track all your job applications from a single dashboard.

Each application can contain:

* Job title
* Company
* Job URL
* Location
* Job type
* Workplace type
* Job description
* Applied date
* Application source
* Salary range
* Priority
* Referral contact
* Recruiter information
* Hiring manager information
* Application status

### Application Status

Applications can move through different stages:

* Applied
* Interview
* Offer
* Rejected
* Withdrawn

---

## 📊 Applications Dashboard

The Applications page provides a centralized view of all saved applications.

Features include:

* Search applications
* Filter by status
* Filter by job type
* Filter by workplace type
* Sort by newest/oldest
* Application detail pages
* Quick access to individual applications

Applications are displayed in a clean, SaaS-style interface designed for quickly scanning large numbers of applications.

---

## 🎯 Interview Management

Track multiple interviews for a single job application.

Each interview can contain:

* Interview type

  * Initial screen
  * Technical
  * Work culture
  * Panel
  * Other
* Interview date
* Interview time
* Interview format

  * Video
  * Phone
  * In-person
  * Other
* Questions asked
* Personal interview experience
* Key learnings

### Interview CRUD

Users can:

* Add interviews
* Edit interviews
* Delete interviews
* View interview history for an application
* Add multiple interviews to the same application

---

## 📝 Interview Experiences

TrackYourJob provides a dedicated **Interview Experiences** section where users can review their previous interview experiences.

Each experience contains:

* Company
* Job title
* Interview type
* Interview format
* Interview date
* Questions asked
* Personal experience
* Learnings

Users can open an individual experience to view the complete interview record.

> Interview experiences are private and are only accessible to the authenticated user who created them.

---

## 🔔 Interview Scheduling

Interview records support scheduling information through:

* Scheduled interview date/time
* Timezone
* Interview deadline

The application is designed to use this information for future interview reminder functionality.

---

## 🏗️ Tech Stack

### Frontend

* React
* React Router
* Tailwind CSS
* TanStack Query
* Axios
* React Toastify

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt

### Development & Infrastructure

* MongoDB Atlas
* REST API
* Git & GitHub

---

## 🧠 Architecture

TrackYourJob follows a client-server architecture.

```text
                    ┌─────────────────────┐
                    │      React App      │
                    │                     │
                    │  React + Tailwind   │
                    │  TanStack Query     │
                    └──────────┬──────────┘
                               │
                              HTTP
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Express API     │
                    │                     │
                    │   Routes            │
                    │   Controllers       │
                    │   Middleware        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      MongoDB        │
                    │                     │
                    │   Users             │
                    │   Jobs              │
                    │   Interviews        │
                    └─────────────────────┘
```

---

## 📁 Project Structure

### Frontend

```text
frontend/
│
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── CurrentStage.jsx
│   └── InterviewStage.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Applications.jsx
│   ├── JobDetails.jsx
│   ├── AddJob.jsx
│   ├── InterviewNotes.jsx
│   └── InterviewExperience.jsx
│
├── hooks/
│   ├── authHooks.js
│   └── jobHooks.js
│
├── utils/
│   └── AxiosInstance.js
│
└── App.jsx
```

### Backend

```text
backend/
│
├── controllers/
│   ├── authController.js
│   ├── jobController.js
│   └── interviewController.js
│
├── models/
│   ├── User.js
│   ├── Job.js
│   └── Interview.js
│
├── routes/
│   ├── authRoutes.js
│   ├── jobRoutes.js
│   └── interviewRoutes.js
│
├── middlewares/
│   └── authMiddleware.js
│
├── app.js
└── server.js
```

---

## 🔗 API Overview

### Authentication

```text
POST   /api/auth/register
POST   /api/auth/login
```

### Jobs

```text
POST   /api/jobs
GET    /api/jobs
GET    /api/jobs/:id
PUT    /api/jobs/:id
DELETE /api/jobs/:id

PATCH  /api/jobs/:id/status
```

### Interviews

```text
POST   /api/jobs/:jobId/interviews
PUT    /api/jobs/:jobId/interviews/:interviewId
DELETE /api/jobs/:jobId/interviews/:interviewId

GET    /api/interviews
GET    /api/interviews/:interviewId
```

---

## 🔒 Security

TrackYourJob ensures that users can only access their own applications and interview experiences.

Protected database queries are scoped using the authenticated user's ID.

For example:

```js
{
    _id: req.params.id,
    user: req.user._id
}
```

Interview experience queries similarly use:

```js
{
    user: req.user._id
}
```

This prevents one authenticated user from accessing another user's private application or interview data.

---

## ⚡ Data Management with TanStack Query

TrackYourJob uses **TanStack Query** for server-state management.

It handles:

* API requests
* Loading states
* Error states
* Query caching
* Cache invalidation
* Updating application data after mutations
* Keeping application and interview data synchronized

Example:

```js
const {
    data,
    isLoading,
    isError
} = useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs
});
```

Mutations invalidate relevant queries so the UI stays synchronized with the backend.

---

## 🎨 UI / UX

The application focuses on a clean and minimal SaaS-style interface.

Design principles include:

* Clean typography
* Responsive layouts
* Consistent spacing
* Clear status indicators
* Horizontal application lists
* Minimal card usage
* Empty states
* Loading skeletons
* Toast notifications
* Responsive forms

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/trackyourjob.git

cd trackyourjob
```

### 2. Install dependencies

Frontend:

```bash
cd frontend
npm install
```

Backend:

```bash
cd backend
npm install
```

### 3. Configure environment variables

Create a `.env` file in the backend:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Add any additional environment variables required by your authentication or email configuration.

### 4. Start the backend

```bash
npm run dev
```

### 5. Start the frontend

```bash
npm run dev
```

---

## 🗺️ Roadmap

### Completed

* [x] User authentication
* [x] Job application CRUD
* [x] Application status management
* [x] Application search and filtering
* [x] Application sorting
* [x] Job detail page
* [x] Multiple interviews per application
* [x] Interview CRUD
* [x] Structured interview experiences
* [x] Questions tracking
* [x] Experience tracking
* [x] Learnings tracking
* [x] Dedicated interview experiences page
* [x] Individual interview experience pages
* [x] Protected user-specific interview data
* [x] Responsive SaaS-style UI

### Planned

* [ ] Application pagination
* [ ] Interview experience pagination
* [ ] Interview reminder emails
* [ ] BullMQ + Redis background jobs
* [ ] Automated 24-hour interview reminders
* [ ] Automated 1-hour interview reminders
* [ ] Rescheduling reminder jobs when interview time changes
* [ ] Cancel reminders when interviews are deleted
* [ ] Dashboard analytics
* [ ] Application statistics
* [ ] Upcoming interview section
* [ ] Email notification preferences

---

## 📌 Future Reminder Architecture

The planned reminder system will use the interview's scheduled time to create background reminder jobs.

```text
User schedules interview
          │
          ▼
      scheduledAt
          │
          ▼
    BullMQ + Redis
          │
      ┌───┴────┐
      ▼        ▼
   24 hours   1 hour
      │        │
      └───┬────┘
          ▼
       Nodemailer
          │
          ▼
   User's email inbox
```

The system will also reschedule or cancel reminder jobs when an interview is updated or deleted.

---

## 👨‍💻 Author

**Your Name**

Built as a full-stack project to solve a real-world problem: keeping job applications and interview preparation organized throughout the hiring process.

---

## ⭐ Why TrackYourJob?

Job searching involves managing a large amount of information:

```text
Job posting
    ↓
Application
    ↓
Recruiter
    ↓
Interview
    ↓
Questions
    ↓
Experience
    ↓
Learnings
    ↓
Next interview
```

TrackYourJob brings this entire workflow into one place so users can build a personal record of their job search and continuously learn from their interviews.
