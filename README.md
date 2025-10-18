# 🚀 PotheGo – AI Driven Smart Parcel Management System

![Project Badge](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)
![Tech Badge](https://img.shields.io/badge/Tech-React%20%7C%20Node.js%20%7C%20MongoDB-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

[Live Demo](https://pothego-fe657.web.app/) 🔗

---

## 🌟 Project Overview

PotheGo is an **intelligent parcel booking, tracking, and delivery platform**.  

🚚 **Key Features:**

- Send parcels across **all 64 districts of Bangladesh**.  
- Track deliveries in **real-time**.  
- Make **secure online payments**.  

![Parcel Tracking GIF](https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif)  

Riders manage deliveries efficiently, while admins have **live analytics dashboards**.  

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB (Mongoose) |
| Auth | Firebase Authentication |
| API Security | JWT |
| Data Fetching | React Query (TanStack) |
| Payments | bKash / Nagad (or mock integration) |
| Analytics | Recharts / Chart.js |
| Maps | Google Maps API |
| HTTP Requests | Axios |

![Tech Stack GIF](https://media.giphy.com/media/xT5LMHxhOfscxPfIfm/giphy.gif)  

---

## 👥 User Roles

- **Customer** – Parcel sender  
- **Rider / Delivery Partner**  
- **Admin**  

---

## ✨ Functional Highlights

### 🔐 Authentication & Authorization
- Firebase registration/login.
- Role-based access control (Customer, Rider, Admin).
- JWT-protected APIs.

### 📦 Customer Features
- Parcel booking with pickup & delivery details.  
- Real-time parcel tracking with **unique Tracking ID**.  
- Online payments (bKash, Nagad, Card) or COD.  
- Parcel history with invoices and notifications.

![Customer Flow GIF](https://media.giphy.com/media/3o7TKtd4GHm3y5XWqk/giphy.gif)  

### 🏍 Rider Features
- Accept/reject deliveries.  
- Update delivery status: `Picked → In-Transit → Delivered`.  
- Optimized routes using **Google Maps API**.  
- Dashboard: total deliveries & earnings.  

### 🛡 Admin Features
- Manage users & riders.  
- Monitor all parcels & disputes.  
- Analytics dashboard with **animated live charts**:

![Admin Dashboard Animated Pie Chart](https://media.giphy.com/media/3o7TKpdUSOwSk5MQpG/giphy.gif)  

---

## 📈 Analytics Charts

**Live Dashboard Charts:**  

```mermaid
pie
    title Parcel Delivery Status
    "Delivered" : 40
    "In Transit" : 30
    "Rider Assigned" : 20
    "Processing" : 10
