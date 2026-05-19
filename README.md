# CapitalGuard

<p align="center">
  <img src="image.png" width="170" alt="CapitalGuard Logo"/>
</p>

<p align="center">
  <strong>Minimalist FinTech Analytics for Capital Preservation</strong>
</p>

---

## Overview

CapitalGuard is a FinTech analytics platform focused on one thing:

> Helping traders survive longer.

Instead of showing vanity metrics and fake profitability, CapitalGuard analyzes trading performance through:
- inflation-adjusted returns,
- risk exposure,
- and statistical survival modeling.

The platform transforms raw trading history into institutional-style risk intelligence.

---

## Core Modules

### The Accountant
Calculates real purchasing-power performance using inflation-adjusted analytics.

### The Risk Officer
Tracks stop-loss discipline, drawdowns, and exposure vulnerabilities.

### The Forecaster
Projects survival runway using statistical risk-of-ruin modeling.

---

## Tech Stack

- Node.js
- Express.js
- Transform Streams
- CSV/JSON ingestion pipeline
- Modular backend architecture

---

## Project Structure

```bash
## 🏗️ Full-Stack Architecture

CapitalGuard is built as a decoupled, full-stack application. It uses a local first React frontend for a secure, terminal like user experience, connected to a modular Node.js/Express backend that handles the heavy mathematical Core Analytics.

/CapitalGuard
├── /frontend ( handled by ai )     # React.js User Interface
│   ├── index.html                  # The main HTML shell
│   └── /src                        # Core React Application
│       ├── main.jsx                # Entry point & Clerk Auth Provider wrapper
│       ├── App.jsx                 # Main layout and routing logic
│       ├── index.css               # Global UI styling (FinTech terminal theme)
│       ├── /pages
│       │   └── Dashboard.jsx       # File upload zone and Grand Orchestrator display
│       ├── /components
│       │   ├── AuthGuard.jsx       # Clerk Sign-in/Sign-up visual components
│       │   └── MetricCard.jsx      # Reusable UI cards for analytics rendering
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
### ⚙️ Data Pipeline

1. **Ingestion:** Client securely uploads raw CSV/JSON trading logs via the React interface.
2. **Normalization:** The Express backend parses and translates messy broker formats into a strict, unified CapitalGuard schema.
3. **Processing:** Data is routed through the Core Analytics engines (Accountant, Risk Officer, Forecaster).
4. **Aggregation:** The backend compiles the mathematical insights into a single JSON payload.
5. **Rendering:** The React Dashboard visualizes the institutional metrics and caches the session locally using IndexedDB.

### Philosophy

CapitalGuard follows a strict rule:

If a metric does not improve survival or capital preservation, it should not exist.

### 🚀 Roadmap

- [ ] Broker API integrations
- [ ] AI behavioral analysis
- [ ] Monte Carlo simulations
- [ ] Portfolio stress testing
- [ ] Real-time analytics