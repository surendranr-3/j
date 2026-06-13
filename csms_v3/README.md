# 🚗 Car Service Management System (CSMS)

A full-stack web application built with **React** (frontend), **Spring Boot** (backend), and **MySQL** (database).

---

## 📁 Project Structure

```
csms/
├── README.md
├── database/
│   └── csms_db.sql          ← Run this first!
├── backend/                 ← Spring Boot application
│   ├── pom.xml
│   └── src/main/java/com/csms/
│       ├── entity/
│       ├── repository/
│       ├── service/
│       └── controller/
└── frontend/                ← React application
    ├── package.json
    └── src/
        ├── App.js
        ├── pages/
        └── services/
```

---

## ⚙️ Prerequisites

| Tool    | Version |
|---------|---------|
| Java    | 17+     |
| Maven   | 3.8+    |
| Node.js | 16+     |
| MySQL   | 8.0+    |

---

## 🗄️ Step 1 — Database Setup

Run the SQL script via CLI:

```bash
mysql -u root -p < database/csms_db.sql
```

Or open `database/csms_db.sql` in MySQL Workbench and execute it.

This creates the database, all tables, and inserts sample data.

### Default Login Credentials

| Role     | Email             | Password  |
|----------|-------------------|-----------|
| Admin    | admin@csms.com    | admin123  |
| Customer | ravi@example.com  | ravi123   |
| Customer | priya@example.com | priya123  |
| Customer | arjun@example.com | arjun123  |

---

## 🔧 Step 2 — Configure Backend

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

---

## 🚀 Step 3 — Run Backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend runs at: http://localhost:8080

---

## 🌐 Step 4 — Run Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at: http://localhost:3000

---

## 📡 API Endpoints

### Users
| Method | Endpoint              | Description       |
|--------|-----------------------|-------------------|
| POST   | /api/users/register   | Register customer |
| POST   | /api/users/login      | Login             |
| GET    | /api/users/customers  | All customers     |
| PUT    | /api/users/{id}       | Update profile    |

### Cars
| Method | Endpoint                | Description     |
|--------|-------------------------|-----------------|
| POST   | /api/cars/user/{userId} | Add car         |
| GET    | /api/cars/user/{userId} | Get user's cars |
| GET    | /api/cars               | All cars        |
| DELETE | /api/cars/{carId}       | Delete car      |

### Service Requests
| Method | Endpoint                          | Description     |
|--------|-----------------------------------|-----------------|
| POST   | /api/service-requests             | Create request  |
| GET    | /api/service-requests             | All requests    |
| GET    | /api/service-requests/user/{id}   | User's requests |
| PUT    | /api/service-requests/{id}/status | Update status   |

---

## 🛠️ Tech Stack

| Layer    | Technology                      |
|----------|---------------------------------|
| Frontend | React 18, React Router 6, Axios |
| Backend  | Java 17, Spring Boot 3.2, JPA   |
| Database | MySQL 8                         |
