<?php
require 'Slim/Slim.php';
require 'crud_api.php';
require 'database.php';
use Slim\Slim;
\Slim\Slim::registerAutoloader();

$app = new Slim();
$app->get('/countries', 'getCountries');
$app->get('/countries/:id',  'getCountry');
$app->post('/countries', 'addCountry');
$app->delete('/countries/:id',	'deleteCountry');
$app->put('/countries/:id', 'updateCountry');

$app->get('/users', 'getUsers');
$app->get('/users/:id', 'getUser');
$app->post('/users', 'addUser');
$app->delete('/users/:id', 'deleteUser');
$app->put('/users/:id', 'updateUser');

$app->run();

?>



