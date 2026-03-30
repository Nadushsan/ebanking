# 🏦 EBanking Pro — Secure Hybrid Banking Application

> A full-stack, security-first banking application built with **Spring Boot**, **React**, and **Flutter** — developed as part of the *Web & Mobile Application Security* course at INPT (Institut National des Postes et Télécommunications), Academic Year 2025/2026.

**Authors:** Nada OUALADI · Bouchra OUTAFRAOUT · messanJustin KPODAR

[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Flutter](https://img.shields.io/badge/Mobile-Flutter-02569B?style=flat-square&logo=flutter&logoColor=white)](https://flutter.dev/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Security Mechanisms](#-security-mechanisms)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Demo](#-demo)

---

## 🌐 Overview

EBanking Pro is a **hybrid banking application** (web + mobile) designed with security as its core principle. The project demonstrates industry-standard practices for protecting sensitive financial data, implementing strong authentication, and building secure REST APIs.

The application supports three user roles:
- **CLIENT** — standard banking operations (deposit, withdrawal, transfer, history)
- **TELLER** — validates deposit and withdrawal requests from clients
- **ADMIN** — full system visibility (users, accounts, global transaction audit)

---

## ✨ Features

### 🔐 Authentication & Security
- User registration with server-side BCrypt password hashing
- JWT-based stateless authentication (24h token validity)
- **Two-Factor Authentication (2FA)** via TOTP (Google Authenticator / Authy)
- Automatic JWT injection via request interceptor

### 💳 Banking Operations
- **Deposit** — client requests, teller validates
- **Withdrawal** — secured with a one-time temporary code (expires in 5 minutes)
- **Transfer** — instant transfer to registered accounts
- Multi-currency support: **USD, EUR, MAD, GBP, CAD, CHF**

### 📊 Dashboard & Analytics
- Real-time account balance display
- Full transaction history with filtering (date, type)
- Visual analytics: pie charts and histograms (Chart.js)
- Beneficiary management

### 🌍 Other
- Multilingual support (French & English) via React Context API
- Real-time notifications (success, error, info)
- Responsive web design + native mobile (iOS/Android)
- Complete audit log for sensitive actions

---

## 🏛️ Architecture

The system follows a **layered architecture** with five distinct layers:

```
┌────────────────────────────────────────────────────┐
│             CLIENT LAYER                           │
│   React (Web)              Flutter (Mobile)        │
└───────────────────┬────────────────────────────────┘
                    │  HTTPS / TLS
┌───────────────────▼────────────────────────────────┐
│             BACKEND LAYER (Spring Boot)            │
│   REST API  ·  Controllers  ·  Services            │
└───────────────────┬────────────────────────────────┘
                    │
┌───────────────────▼────────────────────────────────┐
│             SECURITY LAYER                         │
│   Spring Security  ·  JWT  ·  BCrypt  ·  2FA       │
└───────────────────┬────────────────────────────────┘
                    │
┌───────────────────▼────────────────────────────────┐
│             DATABASE LAYER (PostgreSQL)            │
│   users · accounts · transactions · beneficiaries  │
└────────────────────────────────────────────────────┘
```

### Data Flow — Balance Consultation
1. `AccountList.js` → `apiService.js` (with JWT token)
2. HTTPS request → Spring Security validates the token
3. Controller → Service → JPA Repository → PostgreSQL → response → UI

---

## 🛠️ Tech Stack

| Layer | Technology | Justification |
|-------|-----------|--------------|
| Backend | Spring Boot (Java) | Mature ecosystem, native Spring Security integration |
| Security | Spring Security | Fine-grained access control, CSRF/XSS/clickjacking protection |
| Authentication | JWT (JSON Web Tokens) | Stateless, portable across web & mobile |
| Password Hashing | BCrypt (cost factor 10) | Slow algorithm with salt, brute-force resistant |
| Frontend Web | React | Virtual DOM, modular architecture, native XSS protection |
| Frontend Mobile | Flutter (Dart) | Single codebase for iOS/Android, native performance |
| Database | PostgreSQL | ACID compliance, row-level security, 30+ years of reliability |
| Communication | HTTPS / TLS | End-to-end encryption, Perfect Forward Secrecy |

---

## 🔒 Security Mechanisms

### Password Hashing
Passwords are never stored in plaintext. BCrypt generates a unique salt per password and applies a configurable cost factor (10), making brute-force attacks computationally expensive.

```
Hash example: $2a$10$hxdz.2OHHkGVj4QXYFHNE..r1vGEXTxR.jSVXA8Q87hjh48pFVMNW
```

### JWT Authentication
```
jwt.secret=mySecretKeyForJWTTokenGenerationAndValidation2024VeryLongSecretKey
jwt.expiration=86400000   # 24 hours
```
Every request to a protected endpoint passes through `JwtAuthenticationFilter`, which validates the token before Spring Security processes the request.

### Two-Factor Authentication (2FA)
- Based on **TOTP** standard (RFC 6238)
- Code changes every **30 seconds**, single use
- Implemented with `java-otp` library
- QR code generated for Google Authenticator / Authy
- Fallback: 6-digit code stored in DB with 5-minute expiry

### SQL Injection Prevention
All database interactions use **Spring Data JPA** with parameterized queries — user input is always treated as data, never as executable SQL.

### Other Protections
| Threat | Mitigation |
|--------|-----------|
| XSS | React's automatic escaping + Spring Security headers |
| CSRF | Disabled for stateless JWT; token-based protection |
| Brute Force | BCrypt slowness + rate limiting |
| Clickjacking | Spring Security HTTP headers (`X-Frame-Options`) |
| Session Fixation | Stateless JWT (no server-side sessions) |

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- Flutter SDK 3+
- PostgreSQL 14+
- Maven 3.8+

### 1. Clone the Repository
```bash
git clone https://github.com/Nadushsan/ebanking
cd ebanking
```

### 2. Configure the Database
```sql
CREATE DATABASE ebanking;
CREATE USER ebanking_user WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE ebanking TO ebanking_user;
```

Update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ebanking
spring.datasource.username=ebanking_user
spring.datasource.password=yourpassword

jwt.secret=your_very_long_secret_key_here
jwt.expiration=86400000
```

### 3. Run the Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
The API will be available at `http://localhost:8080`

### 4. Run the Web Frontend
```bash
cd frontend
npm install
npm start
```
The web app will be available at `http://localhost:3000`

### 5. Run the Mobile App
```bash
cd mobile
flutter pub get
flutter run
```

---

## 📁 Project Structure

### Backend
```
src/main/java/com/ebanking/
├── controller/        # REST controllers (AuthController, AccountController, ...)
├── service/           # Business logic (AuthService, TwoFactorService, ...)
├── repository/        # JPA repositories
├── entity/            # JPA entities (User, Account, Transaction, Beneficiary, AuditLog)
├── dto/               # Data Transfer Objects
├── config/            # Security configuration (SecurityConfig)
├── security/          # UserDetails, JWT filter
└── util/              # JwtUtils
```

### Frontend Web (React)
```
src/
├── components/        # Reusable UI components
├── pages/             # Main pages (Login, Register, Dashboard, ...)
├── services/          # API calls (authService.js, apiService.js)
├── context/           # Global state (LanguageContext.js)
└── styles/            # CSS / styling
```

### Mobile (Flutter)
```
lib/
├── models/            # Data models
├── screens/           # UI screens
├── services/          # API service layer
└── widgets/           # Reusable widgets
```

---

## 📱 Screenshots

| Feature | Platform |
|---------|----------|
| Registration with success message | Web |
| Login error handling | Web |
| Dashboard (empty state) | Web |
| 2FA QR code configuration | Web |
| Bank account creation | Web |
| 2FA code verification | Web |
| User registration flow | Mobile |
| Deposit request & confirmation | Mobile |
| Teller deposit validation | Mobile |
| Withdrawal with OTP code | Mobile |
| Teller withdrawal validation | Mobile |
| Money transfer | Mobile |
| Admin panel (users, accounts, audit) | Mobile |

---

## 🎬 Demo

📹 **Video demonstration available here:**
[https://drive.google.com/file/d/11tZeRh3GHVByLfnnb6SBgSpxTa-AThxs/view?usp=drive_link](https://drive.google.com/file/d/11tZeRh3GHVByLfnnb6SBgSpxTa-AThxs/view?usp=drive_link)

---

## 👥 Authors

| Name | Role |
|------|------|
| Nada OUALADI | Full-stack development |
| Bouchra OUTAFRAOUT | Full-stack development |
| messanJustin KPODAR | Full-stack development |

**Institution:** Institut National des Postes et Télécommunications (INPT), Rabat
**Academic Year:** 2025/2026
**Course:** Sécurité des Applications Web et Mobiles — Systèmes Embarqués et Services Numériques

---

## 📄 License

This project was developed for academic purposes at INPT. All rights reserved by the authors.
