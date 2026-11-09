<?php
// Router for PHP's built-in web server (does the job of api/.htaccess, which only Apache reads).
// Usage, from the project folder:  php -S localhost:8000 router.php
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if (preg_match('#^/api(/|$)#', $path) && !is_file(__DIR__ . $path)) {
    // Send every /api/... request to the Slim app.
    $_SERVER['SCRIPT_NAME'] = '/api/index.php';
    $_SERVER['SCRIPT_FILENAME'] = __DIR__ . '/api/index.php';
    chdir(__DIR__ . '/api');
    require __DIR__ . '/api/index.php';
    return true;
}

return false; // let the built-in server serve static files (index.html, css, js, images)
