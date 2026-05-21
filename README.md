# CapitalGuard

<p align="center">
  <img src="image.png" width="170" alt="CapitalGuard Logo"/>
</p>

<p align="center">
  <strong>Minimalist FinTech Analytics for Capital Preservation</strong>
</p>

---

## Overview

CapitalGuard is a premium, data-driven financial backend engine engineered to protect and project trading capital. The platform transforms raw trading history logs into institutional-style risk intelligence by analyzing behavioral discipline, transaction drains, and statistical capital longevity.

## Core Modules

### The Performance Audit (Accountant Engine)
Intercepts uploaded broker files to isolate and calculate real returns against hidden transaction commission drains using a standard $2,000 capital baseline.

### Drawdown Defense (Risk Officer Engine)
Monitors systemic trading behavior profiles. It compares planned risk boundaries against real execution exits to compute a strict compliance Discipline Score while flagging psychological anomalies (Revenge Trading, FOMO, Greed) straight from data tags.

### Growth Projections (Forecaster Engine)
Simulates strategic survival metrics via Gambler's Ruin mathematical modeling, generating statistical probability structures for Capital Runway horizons and Risk of Ruin margins.

---

## Tech Stack & Environment

- **Runtime Environment:** Node.js (Strict Mode / ES Modules execution)
- **Framework:** Express.js
- **Data Serialization:** Multer (multipart streams) & `csv-parser`
- **Security Guardrails:** Helmet HTTP headers & `express-rate-limit` protection
- **Authentication:** Clerk Express Node Integration (`@clerk/clerk-sdk-node`)
- **Client Caching:** Client-side local persistence using browser IndexedDB state wrappers.

---

## Project Structure

```bash
## 🏗️ Full-Stack Architecture

CapitalGuard is built as a decoupled, full-stack application. It uses a local first React frontend for a secure, terminal like user experience, connected to a modular Node.js/Express backend that handles the heavy mathematical Core Analytics.

/CapitalGuard
├── /UI-Design - by Google Stitch   # Original concept mockups (evolved during development)
├── /frontend ( handled by ai )     # React.js User Interface
│   ├── index.html                  # The main HTML shell
│   └── /src                        # Core React Application
│       ├── main.jsx                # Entry point & Clerk Auth Provider wrapper
│       ├── App.jsx                 # Main layout and routing logic
│       ├── index.css               # Global UI styling (FinTech terminal theme)
│       │
│       ├── /components
│       │   ├── AuthGuard.jsx       # Clerk Sign-in/Sign-up visual components
│       │   └── MetricCard.jsx      # Reusable UI cards for analytics rendering
│       │
│       ├── /pages
│       │   └── Dashboard.jsx       # File upload zone and Grand Orchestrator display
│       │   └── Settings.jsx        # App configuration and user profile
│       └── /utils
│           └── storage.js          # Local-first IndexedDB storage logic
│
└── /backend                        # Node.js / Express Core Engine
    ├── app.js                      # Main entry point, Express setup, and global middleware
    ├── /routes                     # API Routing Layer (Express Routers)
    │   ├── authRoutes.js           # Clerk.com authentication endpoints
    │   ├── accountantRoutes.js     # Trade parsing and nominal vs. fee drain endpoints
    │   ├── riskRoutes.js           # Risk Officer endpoints (Stop-Loss Triggers)
    │   └── forecasterRoutes.js     # Forecaster endpoints (Risk-of-Ruin, Runway)
    │
    ├── /Controllers                # Core Analytics Layer (Math & Logic Engines)
    │   ├── accountantController.js # Engine for parsing CSV logic and fee calculations
    │   ├── riskController.js       # Engine for psychological drawdown & danger distance
    │   └── forecasterController.js # Engine for statistical modeling and probability
    │
    └── /utils                      # Shared helper functions and formatting tools
        └── dataNormalizer.js       # Universal exchange CSV/JSON schema translator
```
### 📋 Primary API Routes Reference

1. Data Ingestion Endpoint
Route: POST /api/accountants/upload
Payload Structure: form-data (Key named tradingLog attaching target CSV/JSON file)
Description: Normalizes irregular broker rows into unified schema instances, processing financial health.

2. Forecaster Quantitative Endpoint
Route: POST /api/forecaster/analyze
Payload Structure: application/json ({ tradesArray, startingBalance })
Description: Iterates across historical data sets to run predictive capital preservation models.

3. Risk Officer Parameters Endpoint
Route: POST /api/risk/analyze
Payload Structure: application/json ({ tradesArray })
Description: Quantifies metric deviations to score trading compliance and trigger psychological warning payloads.

Direct clone from terminal context:
git clone [https://github.com/hamidrezaghavami/CapitalGuard.git]
cd CapitalGuard

Establish package dependencies: npm install
Initialize local engine deployment: node app.js
***

### What was updated:
* Fixed the `POST /api/accountant/upload` endpoint path to match your live plural route (`/api/accountants/upload`).
* Named the `form-data` file key matching exactly your router setup parameter (`tradingLog`).
* Cleaned up descriptions to seamlessly match your frontend UI marketing terminology while keeping your awesome map fully intact!