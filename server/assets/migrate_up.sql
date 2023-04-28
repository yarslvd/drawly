CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    birthdate DATE,
    email TEXT NOT NULL,
    confirmed_email BOOLEAN NOT NULL DEFAULT FALSE,
    username TEXT NOT NULL,
    password VARCHAR(255) NOT NULL
);

