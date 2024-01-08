CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

CREATE TABLE threads (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
);

CREATE TABLE replies (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    thread_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    parent_id INT NOT NULL,
    content TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (thread_id) REFERENCES threads(id),
    FOREIGN KEY (parent_id) REFERENCES replies(id)
);

CREATE TABLE activeUsers {
    user_id INT NOT NULL,
    refresh_token_hash TEXT NOT NULL,
    FOREIGN KEY user_id REFERENCES users(id)
}

-- need to fix the primary keys, and reference/foreign keys