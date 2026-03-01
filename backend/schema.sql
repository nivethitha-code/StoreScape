-- ============================================
-- StoreScape Database Schema for Supabase
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS warehouse (
    warehouse_id VARCHAR(4) PRIMARY KEY,
    location VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS branches (
    branch_id VARCHAR(8) PRIMARY KEY,
    warehouse_id VARCHAR(4) REFERENCES warehouse(warehouse_id),
    location VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS store (
    store_id VARCHAR(4) PRIMARY KEY,
    branch_id VARCHAR(8) UNIQUE REFERENCES branches(branch_id),
    address VARCHAR(200),
    contact_number VARCHAR(15)
);

CREATE TABLE IF NOT EXISTS employees (
    employee_id VARCHAR(4) PRIMARY KEY,
    branch_id VARCHAR(8) REFERENCES branches(branch_id),
    employee_name VARCHAR(100) NOT NULL,
    position VARCHAR(20),
    password VARCHAR(100),
    phone_number VARCHAR(15)
);

CREATE TABLE IF NOT EXISTS suppliers (
    supplier_id VARCHAR(4) PRIMARY KEY,
    supplier_name VARCHAR(100) NOT NULL,
    contact VARCHAR(12),
    address VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS products (
    product_id VARCHAR(4) PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    warehouse_id VARCHAR(4) REFERENCES warehouse(warehouse_id),
    stock INTEGER,
    rate_per_unit NUMERIC(10,2)
);

CREATE TABLE IF NOT EXISTS customer (
    customer_id VARCHAR(4) PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(12) UNIQUE,
    email VARCHAR(100),
    address VARCHAR(200),
    start_date DATE,
    expiry_date DATE,
    membership_status VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS purchase (
    purchase_id VARCHAR(4) PRIMARY KEY,
    branch_id VARCHAR(8) REFERENCES branches(branch_id),
    supplier_id VARCHAR(4) REFERENCES suppliers(supplier_id),
    payment NUMERIC(10,2)
);

CREATE TABLE IF NOT EXISTS purchase_details (
    purchase_id VARCHAR(4) REFERENCES purchase(purchase_id),
    product_id VARCHAR(4) REFERENCES products(product_id),
    quantity INTEGER,
    PRIMARY KEY (purchase_id, product_id)
);

CREATE TABLE IF NOT EXISTS sales (
    sales_id VARCHAR(4) PRIMARY KEY,
    customer_id VARCHAR(4) REFERENCES customer(customer_id),
    sales_date DATE,
    payment_method VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS sales_details (
    sales_id VARCHAR(4) REFERENCES sales(sales_id),
    product_id VARCHAR(4) REFERENCES products(product_id),
    quantity INTEGER,
    total_amount NUMERIC(10,2),
    PRIMARY KEY (sales_id, product_id)
);