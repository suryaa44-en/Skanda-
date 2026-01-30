# 🚨 Drishti-NE  
Offline-Resilient AI-Assisted Disaster Response Platform

## 📌 Overview
Drishti-NE is a disaster response and coordination system designed specifically for North-East India, where connectivity is unreliable during floods, landslides, and earthquakes.

The system prioritizes **offline-first reliability**, **guaranteed SOS delivery**, and **human-in-the-loop AI decision support**.

---

## 🧩 System Components

### 1. Commander Dashboard (Web)
- View active missions
- Monitor SOS alerts
- See AI risk insights
- Works even when alerts arrive late

### 2. Responder App (PWA)
- Mobile-first interface
- Offline SOS button
- Local storage + auto-sync
- SMS fallback (simulated)

---

## 🛠 Tech Stack

**Backend**
- Node.js
- Express
- File-based storage (JSON)
- REST APIs

**Frontend**
- React (Vite)
- PWA (Service Worker)
- Offline storage
- Fetch API

**AI**
- Rule-based explainable AI
- No black-box automation
- Human-in-the-loop

---

## 🚨 Offline SOS Flow

1. Responder presses SOS (offline)
2. SOS stored locally on device
3. SMS fallback triggered immediately (simulated)
4. SOS synced to backend when internet returns
5. Commander dashboard displays alert

---

## 🧠 AI Ethics
- AI only provides recommendations
- No automated decisions
- Transparent, explainable rules
- Commander retains full control

---

## ▶️ How to Run the Project

### Backend
```bash
cd backend
npm install
npm run dev
