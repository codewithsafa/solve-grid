# SolveMe — Citizen Problem-Discovery & Reporting Platform
### SIH (Smart India Hackathon) Submission Prototype

SolveMe is a citizen-centric problem discovery and reporting platform. It empowers citizens to report hyper-local issues, enriches reports with community context and discussions, tracks civic issues through a 6-stage lifecycle, and compiles structured problem intelligence for administrators and innovators.

---

## 🏗️ Tech Stack

- **Frontend**: React.js (JavaScript, JSX), Vite, React Router v6, Lucide React
- **Styling**: Vanilla CSS with a formal, clean, restrained civic-tech design system
- **Backend**: Node.js & Express.js REST API
- **Database & ORM**: Prisma ORM with PostgreSQL / Neon PostgreSQL

> [!NOTE]
> **Minimal Dependencies**: Built cleanly without Next.js, Redux, complex state management, heavy animation libraries, or external authentication. Easy for student developers to understand, demonstrate, and extend.

---

## 📁 Project Structure

```text
Solve-grid/
├── .env.example              # Placeholder DATABASE_URL and PORT configs
├── package.json              # Root script runner for concurrent dev
├── README.md                 # Project documentation and setup guide
├── server/                   # Express.js REST API + Prisma ORM
│   ├── .env                  # Environment file with DATABASE_URL
│   ├── package.json
│   ├── src/
│   │   ├── index.js          # Express app, CORS, routes mounting
│   │   ├── db.js             # Unified database layer (Prisma + fallback demo store)
│   │   ├── seedData.js       # 10 realistic Indian civic problem records
│   │   └── routes/
│   │       ├── problems.js   # CRUD & upvoting for problems
│   │       ├── discussions.js# Discussion comments
│   │       ├── info.js       # Community context & ProblemInfo
│   │       └── stats.js      # Dashboard aggregation statistics
│   └── prisma/
│       ├── schema.prisma     # Prisma schema (Problem, Discussion, ProblemInfo)
│       └── seed.js           # Prisma seed script for PostgreSQL
└── client/                   # React.js Frontend (Vite)
    ├── index.html            # Civic metadata and Google Fonts (Inter)
    ├── vite.config.js        # Vite dev server with proxy to backend
    ├── package.json
    └── src/
        ├── index.css         # Clean, formal civic design system
        ├── main.jsx          # React DOM root with BrowserRouter
        ├── App.jsx           # App layout and route declarations
        ├── services/
        │   └── api.js        # API service client
        ├── components/
        │   ├── Sidebar.jsx           # Left sidebar navigation (responsive mobile)
        │   ├── ProblemCard.jsx       # Discovery card (Shorts/focused card style)
        │   ├── ProblemDetailModal.jsx# Focused modal detail view
        │   ├── StatusTimeline.jsx    # 6-stage tracking timeline + demo control
        │   ├── DiscussionSection.jsx # Discussion comments & post form
        │   ├── AddInfoSection.jsx    # Community context addition
        │   └── SimpleBarChart.jsx    # Responsive civic SVG/CSS bar charts
        └── pages/
            ├── LandingPage.jsx       # Screen 1: Welcome / Landing page
            ├── ReportPage.jsx        # 1. Report problem form
            ├── ProblemsPage.jsx      # 2. Problems discovery feed
            ├── InnovationHubPage.jsx # 3. Innovation Hub ("Coming Soon")
            ├── TrackProblemsPage.jsx # 4. Track Problems with live status switcher
            └── DashboardPage.jsx     # 5. Problem statistics and intelligence
```

---

## 🚀 Quick Start & Running Locally

### 1. Run the Platform

From the root directory (`Solve-grid/`), run:

```bash
# Start backend API (port 5000)
npm run dev:server

# In a separate terminal or background, start frontend (port 3000)
npm run dev:client
```

Or run both together using:
```bash
npm run dev
```

Visit the application in your browser:
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API Health**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🗄️ Database Configuration (Neon PostgreSQL)

By default, the server runs with an in-memory/built-in store populated with **10 realistic Indian civic problem reports** (Aligarh, Bengaluru, Bhopal, Pune, Jaipur, Gaya, Ranchi, Lucknow, etc.) so that it can be evaluated instantly without setting up a remote database.

### To connect your live Neon PostgreSQL database:

1. Open `server/.env`.
2. Replace `DATABASE_URL` with your Neon connection string:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://user:password@ep-sample-12345.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```
3. Push the schema to your Neon database:
   ```bash
   cd server
   npx prisma db push
   ```
4. Seed the database with realistic sample civic reports:
   ```bash
   npm run seed
   ```

---

## 🗺️ Application Workflow & Screens

1. **Welcome / Landing Page (`/`)**:
   - Immediate purpose communication: *"See a problem? Report it."*
   - Prominent **Get Started** button leading directly into the platform.

2. **1. Report (`/report`)**:
   - Structured problem reporting: Title, Detailed Description, Category, State, District, Hashtags (with small pill tags), and optional photo upload/preview.
   - Saves to database with initial status `SUBMITTED`.
   - Displays success banner with a quick link to inspect the submitted problem.

3. **2. Problems Discovery (`/problems`)**:
   - Focused civic problem cards (inspired by YouTube focused card views, maintaining a formal civic tone).
   - Shows Title, Location (📍), Category, Hashtags, Description preview, Upvote counter, Discussion counter, Add Info button, and Share button.
   - Clicking opens the **Problem Detail View** with full resolution timeline, community-added context, and live discussions.

4. **Community Context & Discussion**:
   - **Add Information**: Citizens can add verified context (e.g. duration of issue, municipal ticket numbers, local authority escalation notes) saved to `ProblemInfo`.
   - **Discussion**: Open community dialogue to verify and discuss local issues saved to `Discussion`.

5. **3. Innovation Hub (`/hub`)**:
   - Demonstrates future platform direction: *"Shortlisted and structured problems for innovators, startups, NGOs and institutions."*
   - Clean **Coming Soon** indicator with 3 placeholder cards: *Shortlisted Problems*, *Opportunities*, and *Innovation Matching*.

6. **4. Track Problems (`/track`)**:
   - Full civic resolution tracking interface.
   - Visual 6-stage lifecycle:
     `Submitted` → `Categorised` → `Under Validation` → `Validated` → `In Progress` → `Resolved`
   - **Demo Control**: Simple developer/evaluator dropdown allowing manual status transitions for demonstration purposes.

7. **5. Dashboard (`/dashboard`)**:
   - Civic intelligence summary: Total Problems, Categories, States, Districts.
   - Responsive bar charts: *Problems by Category*, *Problems by State*, and *Problems by District*.
