# Pressefy CMS

A small, self-contained blog CMS built to run on plain PHP + SQLite — no MySQL
database, no Node.js runtime, no second WordPress install. Every Hostinger
shared plan already includes PHP, so this needs no plan upgrade.

Two separate credential systems, on purpose:

- **Admin login** (`admin/`) — a human logs in with a username/password to
  write, edit, and delete posts through a normal web UI.
- **Application Passwords** — a per-bot API key (created from
  `admin/tokens.php`) that lets an AI agent create/edit/delete posts and
  upload images over HTTPS, without ever knowing the admin password. Revoking
  one doesn't affect any other bot or the admin login.

## Deploying

1. Upload the whole `cms/` folder to the server, e.g. as
   `https://www.pressefy.com/cms/` (or a subdomain — adjust `UPLOADS_URL` in
   `config.php` if the path differs).
2. Make sure `cms/data/` and `cms/uploads/` are writable by PHP
   (`chmod 755` is usually enough on Hostinger; the app creates the SQLite
   file and upload folders itself on first run).
3. Visit `/cms/admin/setup.php` once to create the admin login, then it locks
   itself — delete `admin/setup.php` afterward if you want to be extra safe.
4. Log in at `/cms/admin/`, go to **Application Passwords**, and generate one
   per AI agent/integration that needs to post. Copy it immediately — it's
   only shown once (only its hash is stored, exactly like WordPress
   Application Passwords).

## Smoke test before trusting it live

This was written without a PHP interpreter available to execute it, so
before pointing the real site's blog section at it:

```bash
php -l cms/api/index.php   # syntax check every file this way first
php -S localhost:8000 -t cms
curl http://localhost:8000/admin/setup.php   # walk through setup in a browser
curl -X POST http://localhost:8000/api/posts \
  -H "Authorization: Bearer <token-from-tokens.php>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test post","content":"Hello","status":"published"}'
curl http://localhost:8000/api/posts          # should list it back
```

## API reference

| Method | Path                    | Auth | Purpose                          |
|--------|-------------------------|------|-----------------------------------|
| GET    | `/api/posts`             | no   | List published posts              |
| GET    | `/api/posts/{slug}`      | no*  | One post (*drafts need a token)    |
| POST   | `/api/posts`             | yes  | Create a post                      |
| PATCH  | `/api/posts/{id}`        | yes  | Edit a post                        |
| DELETE | `/api/posts/{id}`        | yes  | Delete a post                      |
| POST   | `/api/media`             | yes  | Upload an image (`file` field), returns `{ "url": "..." }` |

Auth header for all protected calls: `Authorization: Bearer <application-password>`

## What's deliberately left out

No themes, no plugins, no revisions/versioning, no comments, no multi-author
roles beyond "admin" — the brief was matching WordPress's *create / edit /
delete posts + image upload + Application Password* functionality, not
rebuilding WordPress itself. If more of that turns out to be needed later,
say so and it can be added incrementally rather than guessed at now.
