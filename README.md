# EcoWise AI - Agentic AI for Sustainable Campus Resource & Waste Intelligence

[![License: MIT](https://img.shields.org/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.org/badge/FastAPI-0.109.0-009688.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.org/badge/React-18.2.0-61DAFB.svg)](https://react.dev)
[![Vite](https://img.shields.org/badge/Vite-5.1.0-646CFF.svg)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.org/badge/Tailwind-3.4.1-38B2AC.svg)](https://tailwindcss.com)

EcoWise AI is an industrial sustainability platform designed for automated campus material sorting, real-time telemetry analytics, and Human-in-the-Loop agentic resource management. Powered by FastAPI, React, Recharts, Scikit-Learn ML classifiers, and IBM Granite RAG grounding.

---

## 🚀 Key Modules & Viewports

1. **🔐 Login & Authentication View (`/login`)**:
   - Institutional dark-charcoal `#18181B` modal interface with gold seal badge.
   - Interactive role selector (**Student / Campus** vs **Operator / Admin**).
   - Password show/hide toggle, forgot password workflow, and 1-click quick-fill demo access buttons.

2. **⚡ Real-Time Operations Dashboard (`/dashboard`)**:
   - Dark left navigation sidebar with AI engine status indicator.
   - Recharts telemetry graph tracking real-time **System Efficiency (%)** vs. **Energy Consumption (kWh)**.
   - Status Radial Progress Gauges displaying **Conveyor Throughput (230 Processed)**, **Sorting Arms (95% Active)**, and **Material Purity Rate (98.2%)**.
   - Live KPI cards for classification tasks, total waste tonnage, and anomaly variance.

3. **🔬 Smart Waste Scanner & Visual Diagnostics (`/scanner`)**:
   - Multimodal visual recognition overlay rendering bounding boxes with real confidence scores (e.g. `PET Plastic Bottle [Conf: 94%]`).
   - Image drag-and-drop & pre-loaded demo options (PET bottle, aluminum can, e-waste, cardboard, organic waste).
   - Expandable **IBM Granite RAG Grounding Citation Box** (Ref #GR-883) detailing material composition and campus guidelines.
   - Diagnostics side panel featuring motor vibration line charts, interactive sliders for **AI Classification Threshold** and **Arm Speed**, and live-scrolling terminal logs.

4. **📊 Resource Analytics & EcoAction Planner (`/analytics`)**:
   - Date range selector (*Last 3 Hours*, *Weekly*, *Monthly*) and functional **Report Exporter (CSV & PDF Executive Preview)**.
   - Building-wise electricity (kWh) & water usage comparison bar chart and material purity donut chart.
   - **EcoAction Agent Decision Support Panel** for anomaly detection alert cards, Root Cause Analysis, target KPIs, and Human-in-the-Loop workflow buttons (**Approve Action**, **Modify Plan**, **Reject**).

5. **🌐 Complementary Modules (`/sensors`, `/agent`, `/kb`)**:
   - **Sensor Hub**: IoT wireless mesh telemetry grid for 12 campus nodes.
   - **EcoAction Agent Hub**: Autonomous policy execution logs and HITL configuration.
   - **Knowledge Base**: IBM Granite RAG citation library with search filtering.

---

## 🛠 Project Structure

```
Ecowise AI/
├── backend/
│   ├── app/
│   │   ├── api/                      # FastAPI routers
│   │   │   ├── agent.py              # EcoAction & IBM Bob Agent decision endpoints
│   │   │   ├── analytics.py          # ML resource forecaster endpoints
│   │   │   ├── auth.py               # JWT authentication endpoints
│   │   │   ├── deps.py               # Dependency injection
│   │   │   ├── rag.py                # IBM Granite RAG endpoints
│   │   │   ├── scanner.py            # Computer Vision & classification endpoints
│   │   │   └── telemetry.py          # Real-time conveyor performance endpoints
│   │   ├── ml/                       # Machine Learning Classifier Engine
│   │   │   ├── models/
│   │   │   │   └── waste_classifier_v1.pkl # Serialized Scikit-Learn model weights
│   │   │   ├── classifier.py         # Production ML inference engine
│   │   │   └── train_classifier.py   # Model training & feature extraction pipeline
│   │   ├── rag/                      # IBM Granite RAG Engine
│   │   │   ├── granite_rag.py        # TF-IDF & Cosine similarity vector search
│   │   │   └── knowledge_store.json  # Grounded policy & ISO 14001 document store
│   │   ├── services/                 # Agentic & forecasting services
│   │   │   ├── auth_service.py       # Password hashing & JWT tokens
│   │   │   ├── ibm_bob_agent.py      # IBM Bob Agentic Decision Engine
│   │   │   └── resource_forecaster.py# ML Ridge Regression energy forecaster
│   │   ├── models/                   # SQLAlchemy ORM database models
│   │   ├── schemas/                  # Pydantic validation schemas
│   │   ├── config.py                 # Application settings
│   │   ├── database.py               # DB connection manager
│   │   └── main.py                   # Main FastAPI application & user seeder
│   ├── tests/                        # Backend unit & integration test suite
│   ├── requirements.txt              # Python package dependencies
│   └── ecowise.db                    # SQLite database
├── frontend/
│   ├── src/
│   │   ├── context/                  # AuthContext provider & state
│   │   ├── pages/                    # Login, Dashboard, Scanner, Analytics, Sensors, Agent, KB views
│   │   ├── services/                 # Axios REST API client with mock fallbacks
│   │   ├── types/                    # TypeScript interfaces (auth, telemetry, scanner, agent)
│   │   ├── App.tsx                   # Main application shell & navigation router
│   │   ├── main.tsx                  # React entrypoint
│   │   └── index.css                 # Tailwind CSS styles
│   ├── index.html                    # Main HTML layout
│   ├── package.json                  # NPM dependencies & scripts
│   ├── tailwind.config.js            # Custom Tailwind CSS configuration
│   ├── tsconfig.json                 # TypeScript configuration
│   └── vite.config.ts                # Vite build pipeline setup
├── .gitignore                        # Git exclusion rules
└── README.md                         # Project documentation
```

---

## 💻 Quick Start Guide

### Prerequisites
- Node.js (v18+) & NPM
- Python 3.10+

### 1. Run Backend Server (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*API Documentation will be available at:* `http://127.0.0.1:8000/docs`

### 2. Run Frontend Web Application (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
*Web Application will be available at:* `http://127.0.0.1:5173/`

---

## 🔑 Default Credentials

- **Operator / Admin Access**:
  - Email: `operator@ecowise.ai`
  - Password: `admin123`
- **Student / Campus Access**:
  - Email: `student@ecowise.ai`
  - Password: `student123`
