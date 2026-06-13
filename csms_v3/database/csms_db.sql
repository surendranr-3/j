-- ============================================
-- Car Service Management System (CSMS)
-- Database Setup Script
-- ============================================

-- Create and select database
CREATE DATABASE IF NOT EXISTS csms_db;
USE csms_db;

-- ============================================
-- TABLE: users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    name     VARCHAR(100)        NOT NULL,
    email    VARCHAR(100)        NOT NULL UNIQUE,
    password VARCHAR(255)        NOT NULL,
    phone    VARCHAR(20),
    role     ENUM('ADMIN','CUSTOMER') DEFAULT 'CUSTOMER',
    CONSTRAINT chk_role CHECK (role IN ('ADMIN','CUSTOMER'))
);

-- ============================================
-- TABLE: cars
-- ============================================
CREATE TABLE IF NOT EXISTS cars (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT       NOT NULL,
    car_brand  VARCHAR(100) NOT NULL,
    car_model  VARCHAR(100) NOT NULL,
    car_number VARCHAR(50)  NOT NULL,
    CONSTRAINT fk_car_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- TABLE: service_requests
-- ============================================
CREATE TABLE IF NOT EXISTS service_requests (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT      NOT NULL,
    car_id       BIGINT      NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    request_date DATE         NOT NULL DEFAULT (CURRENT_DATE),
    status       ENUM('PENDING','IN_PROGRESS','COMPLETED','CANCELLED') DEFAULT 'PENDING',
    CONSTRAINT fk_sr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_sr_car  FOREIGN KEY (car_id)  REFERENCES cars(id)  ON DELETE CASCADE
);

-- ============================================
-- SEED DATA: Admin user
-- ============================================
INSERT INTO users (name, email, password, phone, role) VALUES
('Admin', 'admin@csms.com', 'admin123', '9999999999', 'ADMIN');

-- ============================================
-- SEED DATA: Sample customers
-- ============================================
INSERT INTO users (name, email, password, phone, role) VALUES
('Ravi Kumar',   'ravi@example.com',   'ravi123',   '9876543210', 'CUSTOMER'),
('Priya Sharma', 'priya@example.com',  'priya123',  '9123456780', 'CUSTOMER'),
('Arjun Mehta',  'arjun@example.com',  'arjun123',  '9001122334', 'CUSTOMER');

-- ============================================
-- SEED DATA: Sample cars
-- (user_id 2 = Ravi, 3 = Priya, 4 = Arjun)
-- ============================================
INSERT INTO cars (user_id, car_brand, car_model, car_number) VALUES
(2, 'Toyota',  'Corolla',  'KA01AB1234'),
(2, 'Honda',   'City',     'KA02CD5678'),
(3, 'Hyundai', 'i20',      'MH03EF9012'),
(4, 'Maruti',  'Swift',    'DL04GH3456');

-- ============================================
-- SEED DATA: Sample service requests
-- ============================================
INSERT INTO service_requests (user_id, car_id, service_type, request_date, status) VALUES
(2, 1, 'Oil Change',        CURDATE() - INTERVAL 10 DAY, 'COMPLETED'),
(2, 1, 'Tire Rotation',     CURDATE() - INTERVAL 5  DAY, 'IN_PROGRESS'),
(2, 2, 'Battery Replacement', CURDATE(),                 'PENDING'),
(3, 3, 'AC Service',        CURDATE() - INTERVAL 3  DAY, 'COMPLETED'),
(3, 3, 'Brake Inspection',  CURDATE(),                   'PENDING'),
(4, 4, 'Full Service',      CURDATE() - INTERVAL 1  DAY, 'IN_PROGRESS'),
(4, 4, 'Wheel Alignment',   CURDATE(),                   'PENDING');

-- ============================================
-- Verify
-- ============================================
SELECT 'Users'            AS tbl, COUNT(*) AS total FROM users
UNION ALL
SELECT 'Cars',                     COUNT(*)          FROM cars
UNION ALL
SELECT 'Service Requests',         COUNT(*)          FROM service_requests;

-- Guest Requests (no login required)
CREATE TABLE IF NOT EXISTS guest_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    guest_name VARCHAR(100) NOT NULL,
    guest_email VARCHAR(150) NOT NULL,
    guest_phone VARCHAR(20) NOT NULL,
    car_brand VARCHAR(50) NOT NULL,
    car_model VARCHAR(50) NOT NULL,
    car_number VARCHAR(20) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    request_date DATE DEFAULT (CURRENT_DATE),
    status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING'
);
