# CapitalGuard

<p align="center">
  <img src="Frontend/public/image.png" width="170" alt="CapitalGuard Logo"/>
</p>

<p align="center">
  <strong>Minimalist FinTech Analytics for Capital Preservation</strong>
</p>
  🚀 <strong>Live Website:</strong> <a href="https://capital-guard-five.vercel.app">https://capital-guard-five.vercel.app</a>
</p>
---

## Overview

CapitalGuard is a premium, data-driven financial backend engine engineered to protect and project trading capital. The platform transforms raw trading history logs into institutional-style risk intelligence by analyzing behavioral discipline, transaction drains, and statistical capital longevity.

## Core Modules

### The Accountant (Accountant Engine)
Intercepts uploaded broker files to isolate and calculate real returns against hidden transaction commission drains.

### Risk Manager (Risk Officer Engine)
Monitors systemic trading behavior profiles. It compares planned risk boundaries against real execution exits to compute a strict compliance Discipline Score, and acts as the backend analyzer for psychological drawdowns.

### The Forecaster (Forecaster Engine)
Simulates strategic survival metrics via Gambler's Ruin mathematical modeling, generating statistical probability structures for Capital Runway horizons and Risk of Ruin margins.

### The Trading Journal (UI Ledger)
A custom-categorized, visually distinct interactive ledger. This is where users interact with their trades and manually flag psychological anomalies (STRATEGY (Green), REVENGE (Red), NEWS (White), EMOTION (Yellow)) that feed directly into the Risk Manager's backend logic.

---

## Project Structure

```bash
## 🏗️ Full-Stack Architecture

CapitalGuard is built as a decoupled, full-stack application. It uses a local-first React frontend for a secure, terminal-like user experience, connected to a modular Node.js/Express backend that handles the heavy mathematical Core Analytics.

/CapitalGuard
├── /UI-Design                      # Original concept mockups 
├── /Frontend                       # React.js User Interface
│   ├── index.html                  # The main HTML shell
│   └── /src                        # Core React Application
│       ├── main.jsx                # Entry point & Clerk Auth Provider wrapper
│       ├── App.jsx                 # Routing logic
│       ├── Layout.jsx              # Main Sidebar and FinTech Terminal Layout
│       ├── index.css               # Global UI styling (Glassmorphism & Neon)
│       │
│       └── /pages
│           ├── Dashboard.jsx       # File upload zone, Metric Cards, & Dynamic Equity Chart
│           └── Journal.jsx         # Custom-categorized record of ledger executions with color-coded tags
│
└── /backend                        # Node.js / Express Core Engine
    ├── app.js                      # Main entry point, CORS, Rate Limiting, and Clerk Middleware
    ├── /routes                     
    │   └── accountantRoutes.js     # Single Unified API Route (Fires all 5 engines simultaneously)
    │
    ├── /Controllers                # Core Analytics Layer (Math & Logic Engines)
    │   ├── accountantController.js # Nominal vs. Fee drain calculations & Win Rate
    │   ├── riskController.js       # Psychological Drawdown & Distance to Danger limits
    │   └── forecasterController.js # Risk-of-Ruin probabilities & Capital Runway modeling
    │
    └── /utils                      
        └── dataNormalizer.js       # Universal exchange CSV/JSON schema translator
```
### 📋 Primary API Routes Reference

1. **Unified Data Ingestion & Engine Trigger Endpoint**
- **Route:** `POST /api/accountants/upload`
- **Payload Structure:** `multipart/form-data` (Key named `tradingLog` attaching target CSV/JSON file)
- **Description:** This single Master Endpoint ingests irregular broker logs, normalizes them into a unified schema, and simultaneously fires all 5 mathematical engines (Accountant, Forecaster, Risk Officer). It returns a complete, structured JSON payload of your entire financial health to dynamically update the React dashboard.

Direct clone from terminal context:
git clone [https://github.com/hamidrezaghavami/CapitalGuard.git].
cd CapitalGuard

Establish package dependencies: npm install
Initialize local engine deployment: node app.js
***