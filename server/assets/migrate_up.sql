CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    birthdate DATE,
    email TEXT NOT NULL,
    confirmed_email BOOLEAN NOT NULL DEFAULT FALSE,
    username TEXT NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS canvases (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL DEFAULT 'CANVAS',
    content JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS participants (
    canvas_id UUID NOT NULL,
    user_id INT NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) on delete cascade,
    FOREIGN KEY (canvas_id) REFERENCES canvases(id) on delete cascade
);

CREATE TABLE IF NOT EXISTS tokens (
    token text PRIMARY KEY,
    valid_till TIMESTAMP NOT NULL
);