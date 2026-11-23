# CapitalGuard

<p align="center">
  <img src="Frontend/public/image.png" width="170" alt="CapitalGuard Logo"/>
</p>

<p align="center">
  <strong>Minimalist FinTech Analytics for Capital Preservation</strong>
</p>

<p align="center">
  🚀 <strong>Live Website:</strong> <a href="https://capital-guard-five.vercel.app">https://capital-guard-five.vercel.app</a>
</p>

---

## Overview

CapitalGuard is a minimalist, data-driven full-stack financial analytics platform engineered to protect and project trading capital. It pairs a dark-mode React + Vite terminal UI with a modular Node.js/Express calculation backend to transform raw broker trading logs (CSV/JSON) into institutional-style risk intelligence—analyzing hidden transaction drains, behavioral discipline, and statistical capital longevity.

## Core Modules

### The Accountant (Accountant Engine)
Intercepts uploaded broker files to isolate and calculate real net returns against hidden transaction commission drains, computing win rate, profit factor, and equity curve progression.

### Risk Manager (Risk Officer Engine)
Monitors systemic trading behavior profiles. It compares planned stop-loss boundaries against real execution exits to compute a strict compliance Discipline Score, evaluates portfolio vulnerability, and analyzes psychological drawdowns.

### The Forecaster (Forecaster Engine)
Simulates strategic survival metrics via time-based burn rate analysis and Gambler's Ruin mathematical modeling, generating statistical projections for Capital Runway horizons and Risk of Ruin margins.

### The Trading Journal (UI Ledger)
A custom-categorized, visually distinct interactive ledger where users review executed trades and flag psychological anomalies (`STRATEGY` — Green, `REVENGE` — Red, `NEWS` — White, `EMOTION` — Yellow) that tie into the Risk Manager's behavioral analysis.

---

## 🏗️ Project Structure & File Architecture

CapitalGuard is built as a decoupled full-stack application: the Node.js/Express backend lives at the repository root, and the React + Vite frontend lives inside `Frontend/`.

```text
CapitalGuard/
├── .github/
│   └── FUNDING.yml                                # GitHub sponsorship configuration
├── Controllers/                                   # Core analytics layer (math & logic engines)
│   ├── accountantController.js                    # Fee drain, net/gross PnL, win rate, profit factor & equity curve
│   ├── forecasterController.js                    # Time-based survival runway & Risk-of-Ruin modeling
│   ├── riskController.js                          # Distance to danger, psychological drawdown & portfolio vulnerability
│   └── math-example-forecasterContrller.png       # Mathematical reference illustration for the forecaster engine
├── Frontend/                                      # React + Vite user interface
│   ├── public/                                    # Static public assets
│   │   ├── image.png                              # CapitalGuard brand logo
│   │   └── screen.png                             # Landing page centerpiece graphic
│   ├── src/                                       # Core React application
│   │   ├── components/
│   │   │   └── MetricCard.jsx                     # Reusable glassmorphic metric display card
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx                      # CSV/JSON upload zone, metric cards & dynamic equity chart
│   │   │   ├── Journal.jsx                        # Interactive trading ledger with color-coded psychology tags
│   │   │   └── Landing.jsx                        # Public landing page with Clerk sign-in modal
│   │   ├── utils/
│   │   │   └── storage.js                         # IndexedDB caching wrapper (CapitalGuardDB)
│   │   ├── App.jsx                                # Auth-gated layout, sidebar/mobile navigation & view switching
│   │   ├── index.css                              # Global dark-mode FinTech terminal styling
│   │   └── main.jsx                               # React entry point & ClerkProvider setup
│   ├── index.html                                 # Main HTML shell (Tailwind CDN & Inter font)
│   ├── package.json                               # Frontend dependencies & Vite scripts
│   └── package-lock.json                          # Frontend dependency lockfile
├── UI-Design/                                     # Original UI concept mockups
│   ├── Dashboard-UI.png                           # Dashboard screen mockup
│   ├── LandingPageUI.png                          # Landing page mockup
│   ├── Setting-UI.png                             # Settings screen mockup
│   ├── Sing-in-UI.png                             # Sign-in screen mockup
│   ├── Trading-Journal-UI.png                     # Trading journal mockup
│   └── Uploading-UI.png                           # File upload flow mockup
├── routes/                                        # Express API route definitions
│   ├── accountantRoutes.js                        # Unified upload endpoint (POST /api/accountants/upload)
│   ├── authRoutes.js                              # Clerk auth status check (GET /api/auth/user-status)
│   ├── forecasterRoutes.js                        # Standalone forecaster endpoint (POST /api/forecaster/analyze)
│   └── riskRoutes.js                              # Standalone risk officer endpoint (POST /api/risk/analyze)
├── utils/                                         # Shared backend helpers
│   └── dataNormalizer.js                          # Exchange CSV/JSON trade schema normalizer
├── app.js                                         # Express server entry point (CORS, Helmet, rate limiting & Clerk auth)
├── package.json                                   # Root backend dependencies & start script
├── package-lock.json                              # Root backend dependency lockfile
├── SystemDesign.png                               # System architecture diagram
├── .gitignore                                     # Git ignore rules
├── LICENSE                                        # Project license
└── README.md                                      # Project documentation
```

---

## 📋 API Routes Reference

All protected routes require a valid Clerk authentication Bearer token (`Authorization: Bearer <token>`).

1. **Unified Data Ingestion & Engine Trigger Endpoint**
   - **Route:** `POST /api/accountants/upload`
   - **Payload (`multipart/form-data`):**
     - `tradingLog`: Target `.csv` or `.json` broker trade history file
     - `startingBalance`: Initial account balance (required)
   - **Description:** Ingests broker trade logs in memory, normalizes CSV entries into a unified schema, and simultaneously executes the Accountant, Risk Officer, and Forecaster engines—returning a complete analytics payload and trade ledger for the React dashboard.

2. **Additional Endpoints**
   - `GET /api/auth/user-status` — Verifies Clerk session authentication status.
   - `POST /api/risk/analyze` — Runs standalone Distance to Danger and Psychological Drawdown analysis on a JSON `tradesArray`.
   - `POST /api/forecaster/analyze` — Runs standalone Survival Runway and Risk of Ruin projections on a JSON `tradesArray` and `startingBalance`.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/hamidrezaghavami/CapitalGuard.git
cd CapitalGuard
```

### 2. Run the Backend Server

```bash
npm install
npm start
```

Configure a root `.env` file with your Clerk secret key and optional settings (e.g., `CLERK_SECRET_KEY`, `PORT`, `FRONTEND_URL`).

### 3. Run the Frontend App

```bash
cd Frontend
npm install
npm run dev
```

Configure `Frontend/.env` with `VITE_CLERK_PUBLISHABLE_KEY` (and optionally `VITE_API_URL`, which defaults to `http://localhost:3000`).
