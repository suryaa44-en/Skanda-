# **SKANDA 44**

### *Offline-Resilient, AI-Assisted Disaster Response & Coordination Platform*

---

## 📌 Project Overview

**Drishti-NE** is an **offline-first disaster response coordination platform** designed for **North-East India**, a region frequently affected by floods, landslides, and earthquakes where **internet connectivity is unreliable or unavailable during emergencies**.

The platform enables:

* **Command centers** to manage missions and coordinate responders
* **Field responders** to receive tasks and trigger **SOS alerts that are never lost**, even when offline

The system prioritizes **reliability, ethical AI usage, and governance**, aligning with India’s disaster-management needs and the **IndiaAI mission**.

---

## 🚨 Problem Statement

Disaster response in North-East India faces several real-world challenges:

* Frequent network failures during disasters
* Difficult terrain affecting GPS and connectivity
* Internet-dependent dashboards that fail under stress
* SOS alerts getting delayed or lost
* Limited visibility into responder status and task progress

Most existing systems assume **continuous internet access**, which is unrealistic during disasters.

---

## 💡 Solution Overview

**Drishti-NE** adopts a **reliability-first, offline-resilient design**:

* SOS alerts work **with or without internet**
* Tasks are assigned to **specific responders**
* Human commanders remain fully in control
* AI is used **only for decision support**, not automation

This project is a **deployable MVP**, focused on realistic constraints rather than flashy features.

---

## 👥 User Roles

### 1️⃣ Commander (Web Dashboard)

* Create disaster missions
* Assign tasks to responders
* Monitor task progress
* Receive and acknowledge SOS alerts
* View AI-assisted risk insights

### 2️⃣ Responder (Mobile PWA)

* Log in using a responder ID
* View only assigned tasks
* Update task status
* Trigger SOS in emergencies
* Operate even when offline

> Public users are not part of this MVP. Responders represent registered field personnel.

---

## 🔄 Task Workflow

Tasks follow a clear lifecycle:

```
ASSIGNED → IN_PROGRESS → COMPLETED
```

### Workflow:

1. Commander assigns a task
2. Responder receives task on mobile app
3. Responder executes task
4. Responder marks task as completed
5. Commander dashboard reflects status

This ensures **accountability and coordination clarity**.

---

## 🆘 Offline SOS Mechanism (Core Feature)

### Why Offline SOS?

During disasters:

* Internet may be unavailable
* GPS may fail
* Battery conservation is critical

### SOS Flow:

```
Responder triggers SOS
↓
If online → sent immediately
If offline → saved locally
↓
Network restored → auto-sync
↓
Commander receives alert
```

### Guarantee

**No SOS is ever lost.**
Local storage ensures persistence until successful delivery.

---

## 📍 Location Strategy

The MVP uses a **hybrid, reliability-focused location approach**:

* **Human-readable location description** (primary)
* **Latitude & longitude** (optional, if available)

This ensures SOS works even when:

* GPS lock is weak
* Maps cannot load
* Connectivity is unavailable

Navigation decisions remain **human-led**, avoiding unsafe automation.

---

## 🧠 AI Approach (IndiaAI-Aligned)

Drishti-NE uses **explainable, rule-based AI** strictly for **decision support**.

### AI is used for:

* Mission risk indication (LOW / MEDIUM / HIGH)
* Task prioritization suggestions
* After-Action Review insights

### Ethical Principles:

* No black-box models
* No automated decisions
* Human-in-the-loop always

AI assists commanders — it never replaces them.

---

## 🏗️ System Architecture (High Level)

### Frontend

* React (Vite)
* Commander Web Dashboard
* Responder Mobile PWA
* Offline UI indicators

### Backend

* Node.js + Express
* REST APIs
* File-based JSON storage (MVP)
* Event-based logging

### Offline Handling

* Browser localStorage
* Auto-sync on reconnection
* Snapshot-based UI for reliability

---

## 🔐 Security, Privacy & Governance

* Role-based access control
* Mission-level data isolation
* No surveillance or profiling
* Minimal data collection
* DPDP Act aligned

All actions are logged for **audit and accountability**.

---

## 🧪 Dataset Strategy

### Planned Sources:

* NDMA reports
* IMD weather data
* State disaster authority records
* data.gov.in

### MVP Implementation:

* Synthetic and historical data
* No live government data ingestion
* No personal or biometric data

This ensures **ethical and safe usage**.

---

## 🚀 How to Run the Project

### Backend

```bash
cd backend
npm install
npm run dev
```

Runs on:

```
http://localhost:5000
```

### Commander Dashboard

```bash
cd frontend/commander-dashboard
npm install
npm run dev
```

### Responder App

```bash
cd frontend/responder-app
npm install
npm run dev
```

---

## ⚠️ Limitations (Intentional)

* No real SMS gateway (simulated fallback)
* No live map navigation
* No real-time NDMA data ingestion
* No IoT or drone integration

These are **future enhancements**, not MVP gaps.

---

## 🔮 Future Scope

* Multilingual UI (Bhashini)
* Secure government SMS gateways
* Offline maps
* Satellite communication
* Advanced disaster analytics

---

## 🏁 Conclusion

**Drishti-NE** demonstrates a **practical, ethical, and India-ready approach** to disaster response technology.

By prioritizing **offline reliability, human decision-making, and governance**, the platform addresses real disaster conditions rather than ideal network assumptions.

---

### ✅ Project Status

✔ Functional MVP
✔ Offline SOS demonstrated
✔ Task lifecycle implemented
✔ AI aligned with IndiaAI principles

---

## 🎯 FINAL NOTE (IMPORTANT)

This README reflects the **actual working system**, not theoretical claims.
The focus is on **reliability under failure**, which is critical for disaster governance.


