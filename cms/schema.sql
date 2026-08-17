CREATE TABLE IF NOT EXISTS posts (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    slug            TEXT UNIQUE NOT NULL,
    title           TEXT NOT NULL,
    excerpt         TEXT,
    content         TEXT NOT NULL,
    featured_image  TEXT,
    category        TEXT,
    status          TEXT NOT NULL DEFAULT 'draft', -- draft | scheduled | published
    scheduled_at    TEXT,                          -- set when status = scheduled; cron/publish-scheduled.php flips it live
    deleted_at      TEXT,                          -- soft delete (trash); NULL = not trashed
    views           INTEGER NOT NULL DEFAULT 0,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tokens (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    label       TEXT NOT NULL,        -- e.g. "content-bot", "claude-agent"
    token_hash  TEXT NOT NULL,        -- password_hash() of the Application Password
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    revoked     INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS admins (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    username       TEXT UNIQUE NOT NULL,
    password_hash  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS contacts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    phone       TEXT,
    best_time   TEXT,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    read_at     TEXT             -- set when an admin views it in cms/admin/contacts.php
);

CREATE TABLE IF NOT EXISTS subscribers (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    email       TEXT UNIQUE NOT NULL,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
