# Eurovision CRUD App

A single-page web app for browsing and managing Eurovision Song Contest country stats and app users. The front end is jQuery + Bootstrap talking to a small REST API written in PHP with the Slim framework, backed by MySQL.

## Features

- **Home** – a scrollable row of country flag cards; click a card for full details
- **Add / edit / delete countries** – form with validation (no duplicate names, update only if something changed)
- **Countries table** – sortable, searchable list powered by DataTables, with a "More Info" pop-up
- **Manage users** – add, edit and delete users, each with a flag image

## Tech stack

| Layer    | Technology                                      |
|----------|-------------------------------------------------|
| Frontend | HTML, CSS, jQuery, Bootstrap 3, DataTables      |
| Backend  | PHP 8 with Slim 2 (REST API)                    |
| Database | MySQL                                           |

## Project structure

```
eurovision-crud-app/
├── index.html          # Single-page UI (tabs: Home, Countries, Manage Users)
├── router.php          # Router for PHP's built-in server (replaces .htaccess)
├── my_database.sql     # Creates the Eurovision2025CrudApp database with sample data
├── api/
│   ├── index.php       # Slim app + route definitions
│   ├── crud_api.php    # Handlers for countries and users
│   ├── database.php    # PDO connection (configurable via env variables)
│   ├── .htaccess       # URL rewriting when served by Apache/XAMPP
│   └── Slim/           # Slim framework 2.3.3
├── js/main.js          # All front-end logic (AJAX calls, rendering, events)
├── css/                # Bootstrap, DataTables and custom styles (my.css)
└── images/             # Country flag SVGs (named <Country>.svg)
```

## Running the app

### Requirements

- **PHP 8** with the `pdo_mysql` extension (check with `php -m`, which should list `pdo_mysql`)
- **MySQL 8** (or MariaDB)
- A modern web browser

There are two ways to run it. You can use PHP's built-in web server, which works on any OS (option A), or an all-in-one package like XAMPP, MAMP or WAMP (option B).

### Option A: PHP built-in server (macOS, Windows, Linux)

#### 1. Install PHP and MySQL

| OS      | PHP                                                     | MySQL                                                         |
|---------|---------------------------------------------------------|---------------------------------------------------------------|
| macOS   | `brew install php` ([Homebrew](https://brew.sh))         | `brew install mysql`, or the installer from mysql.com          |
| Windows | Download from [windows.php.net](https://windows.php.net/download/), add the folder to `PATH`, and enable `extension=pdo_mysql` in `php.ini` | MySQL Installer from [mysql.com](https://dev.mysql.com/downloads/installer/) |
| Linux   | `sudo apt install php-cli php-mysql`                    | `sudo apt install mysql-server`                                |

Check that it worked with `php -v` (should print PHP 8.x).

#### 2. Start MySQL

- **macOS:** System Settings → MySQL → Start, or `brew services start mysql`
- **Windows:** it runs as a Windows service after installing (check *Services → MySQL80*)
- **Linux:** `sudo systemctl start mysql`

#### 3. Create the database

From the project folder, run:

```bash
mysql -u root -p -e "source my_database.sql"
```

This creates the `Eurovision2025CrudApp` database with 37 countries and 3 sample users. If your root user has no password, leave out `-p`. If `mysql` isn't found, use its full path (macOS installer: `/usr/local/mysql/bin/mysql`; Windows: `"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"`).

> Running this again resets the database to the sample data, which is useful if you have deleted countries while testing.

#### 4. Start the app

From the project folder:

```bash
php -S localhost:8000 router.php
```

Open **http://localhost:8000** in your browser and stop the server with `Ctrl + C`. To run the app again later, repeat step 4. The database keeps its data between runs.

If your MySQL root user has a password, pass it as an environment variable:

| Shell              | Command                                                           |
|--------------------|-------------------------------------------------------------------|
| macOS / Linux      | `DB_PASS='secret' php -S localhost:8000 router.php`               |
| Windows PowerShell | `$env:DB_PASS="secret"; php -S localhost:8000 router.php`         |
| Windows cmd        | `set DB_PASS=secret && php -S localhost:8000 router.php`          |

### Option B: XAMPP / MAMP / WAMP

1. Copy the project folder into the web root (`htdocs` for XAMPP/MAMP, `www` for WAMP).
2. Start Apache and MySQL from the control panel.
3. Import `my_database.sql` in phpMyAdmin (*Import* tab) or with the `mysql` command above.
4. Open `http://localhost/eurovision-crud-app/`. The API URLs are relative, and `api/.htaccess` handles the routing, so any folder name works.

If your MySQL isn't on port 3306 (XAMPP sometimes uses 3307) or has a root password, change the defaults at the top of `api/database.php`.

### Database settings

`api/database.php` reads these environment variables and falls back to the defaults:

| Variable  | Default                 |
|-----------|-------------------------|
| `DB_HOST` | `127.0.0.1`             |
| `DB_PORT` | `3306`                  |
| `DB_NAME` | `Eurovision2025CrudApp` |
| `DB_USER` | `root`                  |
| `DB_PASS` | *(empty)*               |

## API

Base URL: `/api`

| Method | Endpoint          | Description         |
|--------|-------------------|---------------------|
| GET    | `/countries`      | List all countries  |
| GET    | `/countries/{id}` | Get one country     |
| POST   | `/countries`      | Add a country       |
| PUT    | `/countries/{id}` | Update a country    |
| DELETE | `/countries/{id}` | Delete a country    |
| GET    | `/users`          | List all users      |
| GET    | `/users/{id}`     | Get one user        |
| POST   | `/users`          | Add a user (409 if the username is taken) |
| PUT    | `/users/{id}`     | Update a user       |
| DELETE | `/users/{id}`     | Delete a user       |

Example country body:

```json
{
  "name": "Ireland",
  "wins": 7,
  "contests": 57,
  "best_place": "1st",
  "max_points": 226,
  "automatic_qualification": false,
  "first_year": 1965
}
```

Quick test from the terminal:

```bash
curl http://localhost:8000/api/countries
```

## Troubleshooting

- **Blank page or no data** – open the browser dev tools (Network tab) and look at the `/api/countries` response.
- **"Database connection failed: Access denied"** – wrong `DB_USER` / `DB_PASS`.
- **"Unknown database 'Eurovision2025CrudApp'"** – create the database (step 3 above).
- **"could not find driver"** – PHP is missing `pdo_mysql`. On Windows, uncomment `extension=pdo_mysql` in `php.ini`. On Linux, install `php-mysql`. On macOS, use Homebrew's PHP.
- **"Address already in use"** – the server is already running in another terminal, or use another port: `php -S localhost:8001 router.php`.
- **Flag not showing** – images are looked up as `images/<Country name>.svg`, then `.png`. If neither exists, the default flag is shown.

## Potential Future Improvements

- Use prepared statements for all queries. They currently insert user input directly into the SQL, which allows SQL injection and breaks on names containing an apostrophe
- Hash user passwords with `password_hash()` and stop returning them from the API
- Validate input functionality (can't have a country with max points if they never entered a contest)
- Upgrade from Slim 2 to Slim 4 via Composer
- Protect saved data: changes are stored in MySQL and kept between runs, but re-running `my_database.sql` resets everything to the sample data. Splitting it into a schema file and a sample-data file, and adding a backup/export option (e.g. `mysqldump` or an export button), would prevent accidental data loss
