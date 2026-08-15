# DevHunt SRM

> **Product Hunt for Campus Developers** — Ship your projects, get peer reviews, earn XP, and climb the campus leaderboard. Built on the MERN stack.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)

---

## What is DevHunt SRM?

A campus-exclusive developer platform built for **SRM Institute of Science and Technology** students. Think Product Hunt, but for your hostel neighbour's side project.

- 🚀 **Ship projects** — submit your MVP with screenshots, tech stack, GitHub & live links
- ⭐ **Get peer reviews** — structured feedback across UI, code quality, innovation & more
- ⬆️ **Earn upvotes** — community driven discovery
- 🎮 **Level up** — XP system with badge achievements and a campus leaderboard

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router v6, Axios |
| **Backend** | Node.js, Express.js, JWT Auth |
| **Database** | MongoDB Atlas, Mongoose |
| **File Storage** | Cloudinary |
| **Email** | Nodemailer (SMTP) |
| **Styling** | Vanilla CSS, dark mode |

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas (free tier works)
- Cloudinary account (free tier)
- SMTP provider (Mailtrap for dev, SendGrid/Resend for prod)

### Setup

```bash
# 1. Clone
git clone https://github.com/Vineet2511/devhunt-srm.git
cd devhunt-srm

# 2. Install dependencies
cd server && npm install
cd ../client && npm install

# 3. Configure environment
cp server/.env.example server/.env   # fill in your credentials
# create client/.env with: VITE_API_URL=http://localhost:5000/api

# 4. Run
cd server && npm run dev   # Terminal 1 — http://localhost:5000
cd client && npm run dev   # Terminal 2 — http://localhost:5173
```

See [`server/.env.example`](./server/.env.example) for all required environment variables.

---

## Project Structure

```
devhunt-srm/
├── client/          # React + Vite frontend
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── pages/
│       ├── services/
│       ├── styles/
│       └── utils/
│
└── server/          # Node.js + Express backend
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── services/    # Gamification, email, notifications
    ├── validators/
    └── seeds/
```

---

## Architecture

```mermaid
graph LR
    Client["⚛️ React Client"] -- "JWT REST" --> Server["🟢 Express API"]
    Server --> DB["🗄️ MongoDB Atlas"]
    Server --> Cloudinary["☁️ Cloudinary"]
    Server --> SMTP["📧 SMTP"]
```

---

## XP & Levels

| Action | XP |
|--------|----|
| Ship a project | +10 |
| Write a review | +5 |
| Receive a review | +25 |
| Receive an upvote | +2 |

| Level | Title | XP |
|-------|-------|----|
| 1 | Novice Builder | 0+ |
| 2 | Campus Dev | 500+ |
| 3 | Code Ninja | 1,500+ |
| 4 | Ship Master | 3,000+ |
| 5 | Campus Legend | 5,000+ |

---

## Contributing

1. Fork → `git checkout -b feat/your-feature`
2. Commit → `git commit -m "feat: ..."`
3. Push → open a Pull Request

---

## License

MIT © DevHunt SRM



[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)

---

## What is DevHunt SRM?

DevHunt SRM is a campus-exclusive developer ecosystem built for **SRM Institute of Science and Technology** students. Think Product Hunt, but for your hostel neighbour's side project.

- **Project Owners** submit their MVPs, tools, and open-source projects
- **Testers & Reviewers** browse, upvote, and leave structured feedback (pros, cons, suggestions + star ratings)
- **Gamification** tracks everything — earn XP by shipping, reviewing, and receiving upvotes; level up from *Novice Builder* to *Campus Legend*
- **Leaderboard** ranks the top campus devs by XP earned across the semester

---

## Features

| Feature | Details |
|---------|---------|
| 🚀 **Project Submission** | Submit with title, tagline, description, tech stack, GitHub link, live URL, and screenshots |
| ⭐ **Structured Reviews** | Ratings across 5 axes (UI/UX, Code Quality, Innovation, Performance, Documentation) + free-text pros/cons |
| ⬆️ **Upvotes** | Toggle upvotes; project owners earn XP per upvote received |
| 🎮 **XP & Levels** | Ship (+10 XP) · Review (+5 XP) · Receive Review (+25 XP) · Receive Upvote (+2 XP) |
| 🏆 **Leaderboard** | Live ranking of top developers on campus |
| 🔔 **Notifications** | In-app notifications for upvotes, reviews, and project milestones |
| 🔐 **Auth** | JWT-based auth with email verification and password reset via SMTP |
| 🛡️ **Admin Panel** | Manage users, moderate projects, promote/demote roles, test SMTP relay |
| 📱 **Responsive** | Mobile-first brutalist dark-mode UI |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router v6, Axios |
| **Backend** | Node.js 20, Express.js, JWT Auth (httpOnly cookies) |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **File Storage** | Cloudinary (image CDN for project screenshots and avatars) |
| **Email** | Nodemailer (SMTP — works with SendGrid, Resend, Mailtrap, or any SMTP) |
| **Styling** | Vanilla CSS with custom properties, dark mode |

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (free tier works) or local MongoDB
- Cloudinary account (free tier — for image uploads)
- An SMTP provider (Mailtrap for dev, SendGrid/Resend for production)

### 1. Clone the Repository

```bash
git clone https://github.com/Vineet2511/devhunt-srm.git
cd devhunt-srm
```

### 2. Set Up the Server

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env` and fill in your credentials:

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/devhunt-srm

# JWT
JWT_SECRET=your_strong_random_secret_here
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

# Frontend (CORS)
CLIENT_URL=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (SMTP)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_EMAIL=your_smtp_user
SMTP_PASSWORD=your_smtp_password
FROM_EMAIL=noreply@devhunt-srm.edu
FROM_NAME="DevHunt SRM"
```

### 3. Set Up the Client

```bash
cd ../client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run Both Dev Servers

Open two terminals:

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

The app will be available at **http://localhost:5173**.

### 5. Seed Initial Data (Optional)

```bash
cd server
node seeds/badgeSeeder.js   # Seeds badge definitions
```

---

## Project Structure

```
devhunt-srm/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── contexts/       # AuthContext, NotificationContext
│       ├── pages/          # Route-level page components
│       ├── services/       # Axios API service layer
│       ├── styles/         # Per-page CSS modules
│       └── utils/          # Helper functions
│
└── server/                 # Node.js + Express backend
    ├── config/             # DB connection, Cloudinary config
    ├── controllers/        # Route handler logic
    ├── middleware/         # auth, validate, upload, rateLimit
    ├── models/             # Mongoose schemas
    ├── routes/             # Express routers
    ├── services/           # Gamification, notification, email
    ├── validators/         # express-validator rules
    └── seeds/              # DB seeder scripts
```

---

## System Architecture

```mermaid
graph TB
    subgraph Users["👤 User Roles"]
        PO["🏗️ Project Owner<br/>(Student who ships)"]
        TR["🧪 Tester / Reviewer<br/>(Student who tests)"]
    end

    subgraph Client["⚛️ React Frontend · Vite"]
        direction TB
        RC["React Router<br/>+ ProtectedRoute"]
        Pages["Pages<br/>Home · Explore · ProjectDetail<br/>SubmitProject · Dashboard<br/>Profile · Leaderboard"]
        Components["Components<br/>ProjectCard · ReviewForm<br/>UpvoteButton · StarRating<br/>Navbar · SearchBar"]
        State["State Management<br/>AuthContext · NotificationContext"]
        Services["API Service Layer<br/>Axios Instance<br/>+ JWT Interceptors"]
    end

    subgraph Server["🟢 Node.js + Express Backend"]
        direction TB
        MW["Middleware Pipeline<br/>auth · validate · upload<br/>rateLimiter · errorHandler"]
        Routes["REST API Routes<br/>/api/auth · /api/projects<br/>/api/reviews · /api/upvotes<br/>/api/users · /api/notifications"]
        Controllers["Controllers<br/>authController · projectController<br/>reviewController · upvoteController<br/>userController · notificationController"]
        BizLogic["Services Layer<br/>gamificationService<br/>notificationService<br/>emailService"]
    end

    subgraph Database["🗄️ MongoDB Atlas"]
        Users_Col["Users<br/>name, email, xp, level, badges, role"]
        Projects_Col["Projects<br/>title, tagline, techStack,<br/>screenshots, upvoteCount, avgRating"]
        Reviews_Col["Reviews<br/>ratings, pros, cons, suggestion"]
        Upvotes_Col["Upvotes<br/>user ref + project ref (unique)"]
        Notif_Col["Notifications<br/>type, message, read status"]
    end

    subgraph External["☁️ External Services"]
        Cloud["Cloudinary<br/>Image CDN"]
        Email["SMTP Provider<br/>SendGrid / Resend / Mailtrap"]
    end

    PO -- "Submit / Edit Project" --> Client
    TR -- "Browse / Upvote / Review" --> Client
    Services -- "HTTP REST + JWT" --> MW
    MW --> Routes --> Controllers --> BizLogic --> Database
    Controllers --> Database
    Controllers -- "Image upload" --> Cloud
    BizLogic -- "Send emails" --> Email
```

---

## API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login, returns JWT cookie |
| GET | `/api/auth/me` | ✅ | Get current user |
| POST | `/api/auth/forgot-password` | — | Send reset email |
| GET | `/api/projects` | — | List/search/filter projects |
| POST | `/api/projects` | ✅ | Submit a project |
| GET | `/api/projects/:id` | — | Get project + reviews |
| DELETE | `/api/projects/:id` | ✅ (owner) | Delete own project |
| POST | `/api/reviews/:projectId` | ✅ | Submit a review |
| POST | `/api/upvotes/:projectId/toggle` | ✅ | Toggle upvote |
| GET | `/api/users/leaderboard` | — | Get XP leaderboard |
| PATCH | `/api/users/profile` | ✅ | Update profile |
| GET | `/api/admin/stats` | ✅ (admin) | Platform statistics |

---

## Environment Variables Reference

### Server (`server/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Strong random string for JWT signing |
| `JWT_EXPIRE` | ✅ | JWT lifetime (e.g. `7d`) |
| `CLIENT_URL` | ✅ | Frontend URL for CORS |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret |
| `SMTP_HOST` | ✅ | SMTP server hostname |
| `SMTP_PORT` | ✅ | SMTP port (587 for TLS, 2525 for Mailtrap) |
| `SMTP_EMAIL` | ✅ | SMTP auth user |
| `SMTP_PASSWORD` | ✅ | SMTP auth password |
| `FROM_EMAIL` | ✅ | Sender email address |
| `PORT` | — | Server port (default: 5000) |

### Client (`client/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ | Backend API base URL |

---

## XP & Gamification System

| Action | XP Earned | Who |
|--------|-----------|-----|
| Submit a project | +10 XP | Project Owner |
| Write a peer review | +5 XP | Reviewer |
| Receive a review | +25 XP | Project Owner |
| Receive an upvote | +2 XP | Project Owner |

### Level Tiers

| Level | Title | XP Required |
|-------|-------|-------------|
| 1 | Novice Builder | 0 – 499 XP |
| 2 | Campus Dev | 500 – 1,499 XP |
| 3 | Code Ninja | 1,500 – 2,999 XP |
| 4 | Ship Master | 3,000 – 4,999 XP |
| 5 | Campus Legend | 5,000+ XP |

---

## Contributing

SRM students are welcome to open issues, suggest features, or submit pull requests.

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push and open a Pull Request

---

## License

MIT © DevHunt SRM


---

## System Architecture

```mermaid
graph TB
    subgraph Users["👤 User Roles"]
        PO["🏗️ Project Owner<br/>(Student who ships)"]
        TR["🧪 Tester / Reviewer<br/>(Student who tests)"]
    end

    subgraph Client["⚛️ React Frontend · Vite"]
        direction TB
        RC["React Router<br/>+ ProtectedRoute"]
        Pages["Pages<br/>Home · Explore · ProjectDetail<br/>SubmitProject · Dashboard<br/>Profile · Leaderboard"]
        Components["Components<br/>ProjectCard · ReviewForm<br/>UpvoteButton · StarRating<br/>Navbar · SearchBar"]
        State["State Management<br/>AuthContext · ThemeContext<br/>NotificationContext"]
        Services["API Service Layer<br/>Axios Instance<br/>+ JWT Interceptors"]
    end

    subgraph Server["🟢 Node.js + Express Backend"]
        direction TB
        MW["Middleware Pipeline<br/>auth · validate · upload<br/>rateLimiter · errorHandler"]
        Routes["REST API Routes<br/>/api/auth · /api/projects<br/>/api/reviews · /api/upvotes<br/>/api/users · /api/notifications"]
        Controllers["Controllers<br/>authController · projectController<br/>reviewController · upvoteController<br/>userController · notificationController"]
        BizLogic["Services Layer<br/>gamificationService<br/>notificationService<br/>emailService"]
        Validators["Validators<br/>authValidators<br/>projectValidators<br/>reviewValidators"]
    end

    subgraph Database["🗄️ MongoDB Atlas"]
        direction TB
        Users_Col["Users Collection<br/>name, email, password, xp,<br/>level, badges, role"]
        Projects_Col["Projects Collection<br/>title, tagline, description,<br/>techStack, screenshots,<br/>upvoteCount, avgRating"]
        Reviews_Col["Reviews Collection<br/>ratings object, pros, cons,<br/>suggestion, overallScore"]
        Upvotes_Col["Upvotes Collection<br/>user ref + project ref<br/>(compound unique)"]
        Badges_Col["Badges Collection<br/>name, icon, criteria"]
        Notif_Col["Notifications Collection<br/>type, message, read status"]
    end

    subgraph External["☁️ External Services"]
        Cloud["Cloudinary<br/>Image CDN"]
        Email["Email Provider<br/>(SendGrid / Resend)"]
    end

    PO -- "Submit / Edit Project<br/>View Dashboard" --> Client
    TR -- "Browse / Search<br/>Upvote / Review" --> Client

    RC --> Pages
    Pages --> Components
    Pages --> State
    State --> Services
    Services -- "HTTP REST<br/>+ JWT Bearer Token" --> MW

    MW --> Routes
    Routes --> Validators
    Validators --> Controllers
    Controllers --> BizLogic
    Controllers --> Database
    BizLogic --> Database

    Controllers -- "Upload images" --> Cloud
    BizLogic -- "Send emails" --> Email

    Projects_Col -. "owner ref" .-> Users_Col
    Reviews_Col -. "project ref" .-> Projects_Col
    Reviews_Col -. "reviewer ref" .-> Users_Col
    Upvotes_Col -. "user + project refs" .-> Users_Col
    Upvotes_Col -. "user + project refs" .-> Projects_Col
    Notif_Col -. "recipient ref" .-> Users_Col

    BizLogic -- "Award XP<br/>& Badges" --> Users_Col
    BizLogic -- "Dispatch<br/>Notifications" --> Notif_Col
```

---

## Data Flow Summary

```mermaid
sequenceDiagram
    participant PO as 🏗️ Project Owner
    participant UI as ⚛️ React Client
    participant API as 🟢 Express API
    participant GS as 🎮 Gamification Service
    participant DB as 🗄️ MongoDB
    participant TR as 🧪 Tester

    Note over PO,DB: Project Submission Flow
    PO->>UI: Fill project form + upload images
    UI->>API: POST /api/projects (JWT auth)
    API->>DB: Save Project document
    API->>GS: awardXP(owner, +10, "project_submitted")
    GS->>DB: Update User.xp, check badge criteria
    API-->>UI: 201 Created + project data
    UI-->>PO: Redirect to project page ✅

    Note over TR,DB: Review & Feedback Flow
    TR->>UI: Browse Explore page
    UI->>API: GET /api/projects?sort=newest
    API->>DB: Query Projects (paginated)
    API-->>UI: Project list
    TR->>UI: Open project → Write structured review
    UI->>API: POST /api/reviews/:projectId (JWT auth)
    API->>DB: Save Review, recalculate avgRating
    API->>GS: awardXP(reviewer, +5, "review_submitted")
    API->>GS: awardXP(owner, +25, "review_received")
    GS->>DB: Update both Users, dispatch Notification
    API-->>UI: 201 Created
    UI-->>TR: Review posted + XP toast 🎉

    Note over TR,DB: Upvote Flow
    TR->>UI: Click upvote button
    UI->>API: POST /api/upvotes/:projectId/toggle
    API->>DB: Insert/Delete Upvote, update upvoteCount
    API->>GS: awardXP(voter, +2) if new upvote
    API-->>UI: { upvoted: true, count: 42 }
    UI-->>TR: Button animates, count updates ⬆️
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router, Axios |
| **Backend** | Node.js, Express.js, JWT Auth |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **File Storage** | Cloudinary |
| **Styling** | Vanilla CSS (custom properties + dark mode) |

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/<your-username>/devhunt-srm.git
cd devhunt-srm

# Install dependencies
cd server && npm install
cd ../client && npm install

# Set up environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env

# Run both dev servers
npm run dev
```
