-- Create schema
CREATE SCHEMA IF NOT EXISTS review_dba;

CREATE USER pito_review WITH PASSWORD 'Hello@2025';

GRANT USAGE ON SCHEMA review_dba TO pito_review;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA review_dba TO pito_review;
GRANT CREATE ON SCHEMA review_dba TO pito_review;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA review_dba TO pito_review;
ALTER SCHEMA review_dba OWNER TO pito_review;

ALTER DEFAULT PRIVILEGES IN SCHEMA review_dba
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO pito_review;

SET search_path TO review_dba;

-- Create tables
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);

CREATE TABLE review_audit_log (
    id SERIAL PRIMARY KEY,
    review_id INTEGER NOT NULL,
    change_type VARCHAR(50) NOT NULL,
    previous_content TEXT,
    new_content TEXT,
    edited_by INTEGER NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    user_type VARCHAR(50) NOT NULL
);

CREATE TABLE review_flags (
    id SERIAL PRIMARY KEY,
    review_id INTEGER NOT NULL,
    flagged_by INTEGER NOT NULL,
    reason TEXT,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE review_status_history (
    id SERIAL PRIMARY KEY,
    review_id INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    changed_by INTEGER NOT NULL,
    reason TEXT,
    changed_at TIMESTAMP NOT NULL
);

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    verified BOOLEAN NOT NULL,
    external_customer_id VARCHAR(255),
    source_system_id INTEGER NOT NULL
);

CREATE TABLE source_system (
    id SERIAL PRIMARY KEY,
    system_name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE sub_orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    partner_id INTEGER NOT NULL,
    order_status VARCHAR(50) NOT NULL,
    external_order_id VARCHAR(255),
    source_system_id INTEGER NOT NULL,
    external_sub_order_id VARCHAR(255)
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    comment TEXT,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    source_system VARCHAR(50) NOT NULL,
    order_id INTEGER NOT NULL,
    review_photos TEXT[],
    partner_id INTEGER NOT NULL,
    customer_id INTEGER NOT NULL,
    avg_rating_value NUMERIC(3,2)
);

CREATE TABLE partner_replies (
    id SERIAL PRIMARY KEY,
    review_id INTEGER NOT NULL,
    partner_id INTEGER NOT NULL,
    reply TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE TABLE review_ratings (
    id SERIAL PRIMARY KEY,
    review_id INTEGER NOT NULL,
    rating_category_id INTEGER NOT NULL,
    rating_value INTEGER NOT NULL
);

CREATE TABLE rating_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE partners (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    profile_picture TEXT,
    external_partner_id VARCHAR(255),
    source_system_id INTEGER NOT NULL
);

CREATE TABLE partner_review_summary (
    partner_id INTEGER PRIMARY KEY,
    avg_rating_food_quality NUMERIC(3,2),
    avg_rating_delivery_timeliness NUMERIC(3,2),
    avg_rating_order_accuracy NUMERIC(3,2),
    avg_rating_packaging NUMERIC(3,2),
    total_reviews INTEGER NOT NULL,
    total_replies INTEGER NOT NULL
);

-- Add foreign key constraints
ALTER TABLE review_audit_log ADD FOREIGN KEY (review_id) REFERENCES reviews(id);
ALTER TABLE review_audit_log ADD FOREIGN KEY (edited_by) REFERENCES admins(id);
ALTER TABLE review_audit_log ADD FOREIGN KEY (edited_by) REFERENCES customers(id);

ALTER TABLE review_flags ADD FOREIGN KEY (review_id) REFERENCES reviews(id);
ALTER TABLE review_flags ADD FOREIGN KEY (flagged_by) REFERENCES admins(id);

ALTER TABLE review_status_history ADD FOREIGN KEY (review_id) REFERENCES reviews(id);
ALTER TABLE review_status_history ADD FOREIGN KEY (changed_by) REFERENCES admins(id);

ALTER TABLE customers ADD FOREIGN KEY (source_system_id) REFERENCES source_system(id);

ALTER TABLE sub_orders ADD FOREIGN KEY (customer_id) REFERENCES customers(id);
ALTER TABLE sub_orders ADD FOREIGN KEY (partner_id) REFERENCES partners(id);
ALTER TABLE sub_orders ADD FOREIGN KEY (source_system_id) REFERENCES source_system(id);

ALTER TABLE reviews ADD FOREIGN KEY (order_id) REFERENCES sub_orders(id);
ALTER TABLE reviews ADD FOREIGN KEY (partner_id) REFERENCES partners(id);
ALTER TABLE reviews ADD FOREIGN KEY (customer_id) REFERENCES customers(id);

ALTER TABLE partner_replies ADD FOREIGN KEY (review_id) REFERENCES reviews(id);
ALTER TABLE partner_replies ADD FOREIGN KEY (partner_id) REFERENCES partners(id);

ALTER TABLE review_ratings ADD FOREIGN KEY (review_id) REFERENCES reviews(id);
ALTER TABLE review_ratings ADD FOREIGN KEY (rating_category_id) REFERENCES rating_categories(id);

ALTER TABLE partners ADD FOREIGN KEY (source_system_id) REFERENCES source_system(id);

ALTER TABLE partner_review_summary ADD FOREIGN KEY (partner_id) REFERENCES partners(id);