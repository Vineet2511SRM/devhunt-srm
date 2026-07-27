# DevHunt SRM

> **Product Hunt for Campus Developers** — A platform where students list their projects, and peers test them, leave structured feedback, and collaborate. Built on the MERN stack.

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
