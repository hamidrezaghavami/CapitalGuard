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
## 🏗️ Backend Architecture

The CapitalGuard backend follows a modular, Controller-Route architecture to separate the API routing from the heavy mathematical Core Analytics Layer.

/capital-guard-backend
├── app.js                      # Main entry point, Express setup, and global middleware
├── /routes                     # API Routing Layer (Express Routers)
│   ├── authRoutes.js           # Clerk.com authentication endpoints
│   ├── accountantRoutes.js     # Trade parsing and nominal vs. fee drain endpoints
│   ├── riskRoutes.js           # Risk Officer endpoints (Stop-Loss Triggers)
│   └── forecasterRoutes.js     # Forecaster endpoints (Risk-of-Ruin, Runway)
│
├── /controllers                # Core Analytics Layer (Math & Logic Engines)
│   ├── accountantController.js # Engine for parsing CSV logic and fee calculations
│   ├── riskController.js       # Engine for psychological drawdown & danger distance
│   └── forecasterController.js # Engine for statistical modeling and probability
│
├── /middleware                 # Custom Express middleware (e.g., error handling)
├── /services                   # External API integrations and database services
└── /utils                      # Shared helper functions and formatting tools
```
### Data Pipeline

#### 1. Upload trading history
#### 2. Normalize broker data
#### 3. Execute analytics engines
#### 4. Aggregate dashboard insights
#### 5. Render minimalist reports

### Philosophy

CapitalGuard follows a strict rule:

If a metric does not improve survival or capital preservation, it should not exist.

### Roadmap

* Broker API integrations
* AI behavioral analysis
* Monte Carlo simulations
* Portfolio stress testing
* Real-time analytics