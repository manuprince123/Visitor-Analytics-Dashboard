# VisitorIQ — Frontend Client

> **React 18 + Vite + Tailwind CSS** frontend for the VisitorIQ Visitor Analytics Dashboard.

See the **[root README](../README.md)** for full setup instructions, API reference, and project documentation.

## Quick Start

```bash
npm install
npm run dev        # Development server → http://localhost:5173
npm run build      # Production build
npm run preview    # Preview production build
```

## Frontend Stack

| Package           | Purpose                        |
|-------------------|-------------------------------|
| React 18          | UI framework                  |
| Vite 5            | Build tool + dev server        |
| Tailwind CSS 3    | Utility-first styling          |
| React Router v6   | Client-side routing            |
| Recharts          | 8 chart types                 |
| Axios             | HTTP client with interceptors  |
| react-hot-toast   | Toast notifications            |
| react-icons/md    | Material Design icon set       |
| uuid              | Visitor/session ID generation  |

## Source Structure

```
src/
├── context/         # AuthContext (JWT), ThemeContext (dark mode)
├── services/        # api.js (Axios), visitorTracker.js (auto-tracking)
├── hooks/           # useDashboard, useVisitors, useAuth, useTheme
├── layouts/         # DashboardLayout (sidebar + navbar shell)
├── components/      # StatCard, ChartCard, Sidebar, TopNavbar,
│                    # VisitorTable, VisitorDetailModal, ExportButton,
│                    # LoadingSpinner, ProtectedRoute
└── pages/           # LandingPage, LoginPage, Dashboard, Analytics,
                     # VisitorLogs, Settings, NotFound
```

## Environment

Ensure the backend is running at `http://localhost:5000` before starting the frontend.
The API base URL is configured in `src/services/api.js`.
