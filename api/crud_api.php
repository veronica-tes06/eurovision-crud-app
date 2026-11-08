<?php

function getCountries() {
    $query = "SELECT * FROM country ORDER BY name";
    try {
        global $db;
        $countries = $db->query($query);
        $countries = $countries->fetchAll(PDO::FETCH_ASSOC);
        header("Content-Type: application/json", true);
        echo '{"country": ' . json_encode($countries) . '}';
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}

function getCountry($id) {
    $query = "SELECT * FROM country WHERE id = '$id'";
    try {
        global $db; 
        $countries = $db->query($query);  
		$country = $countries->fetch(PDO::FETCH_ASSOC);
        header("Content-Type: application/json", true);
        echo json_encode($country);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function addCountry() {
    global $app;
    $request = $app->request();
    $country = json_decode($request->getBody());
    $name = $country->name;
    $wins = $country->wins;
    $contests = $country->contests;
    $best_place = $country->best_place;
    $max_points = $country->max_points;
    $automatic_qualification = $country->automatic_qualification ? 1 : 0;
    $first_year = $country->first_year;

    $query = "INSERT INTO country 
          (name, wins, contests, best_place, max_points, automatic_qualification, first_year)
          VALUES
          ('$name', '$wins', '$contests', '$best_place', '$max_points', '$automatic_qualification', '$first_year')";
    try {
        global $db;
		$db->exec($query);
		$country->id = $db->lastInsertId();
		echo json_encode($country);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}

function deleteCountry($id) {
    $query = "DELETE FROM country WHERE id = '$id'";
    try {
        global $db; 
        $db->exec($query);
        echo json_encode(['message' => "Country with ID $id deleted successfully."]);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}

function updateCountry($id) {
    global $app;
    $request = $app->request();
    $country = json_decode($request->getBody());
    $name = $country->name;
    $wins = $country->wins;
    $contests = $country->contests;
    $best_place = $country->best_place;
    $max_points = $country->max_points;
    $automatic_qualification = $country->automatic_qualification ? 1 : 0;
    $first_year = $country->first_year;
    $query = "UPDATE country 
              SET name='$name', wins='$wins', contests='$contests', best_place='$best_place', 
                  max_points='$max_points', automatic_qualification='$automatic_qualification', first_year='$first_year' 
              WHERE id='$id'";
    try {
        global $db;
        $db->exec($query);
        echo json_encode($country); 
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getUsers() {
    $query = "SELECT * FROM user ORDER BY name";
    try {
        global $db;
        $users = $db->query($query);
        $users = $users->fetchAll(PDO::FETCH_ASSOC);
        header("Content-Type: application/json", true);
        echo '{"users": ' . json_encode($users) . '}';
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}

function getUser($id) {
    $query = "SELECT * FROM user WHERE id = '$id'";
    try {
        global $db; 
        $stmt = $db->query($query);  
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        header("Content-Type: application/json", true);
        echo json_encode($user);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function addUser() {
    global $app;
    $request = $app->request();
    $user = json_decode($request->getBody());

    $name = $user->name;
    $username = $user->username;
    $password = $user->password;
    $image = isset($user->image) ? $user->image : null;

    try {
        global $db;
        
        // Check if username already exists
        $checkQuery = "SELECT COUNT(*) as count FROM user WHERE username = '$username'";
        $stmt = $db->query($checkQuery);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result['count'] > 0) {
            header("Content-Type: application/json", true);
            http_response_code(409);
            echo json_encode(['error' => 'Username already exists']);
            return;
        }
        
        $query = "INSERT INTO user (name, username, password, image)
                  VALUES ('$name', '$username', '$password', " . ($image ? "'$image'" : "NULL") . ")";
        
        $db->exec($query);
        $user->id = $db->lastInsertId();
        header("Content-Type: application/json", true);
        echo json_encode($user);
    } catch(PDOException $e) {
        header("Content-Type: application/json", true);
        http_response_code(500);//error
        echo json_encode(['error' => $e->getMessage()]); 
    }
}

function updateUser($id) {
    global $app;
    $request = $app->request();
    $user = json_decode($request->getBody());

    $name = $user->name;
    $username = $user->username;
    $password = $user->password;
    $image = isset($user->image) ? $user->image : null;

    $query = "UPDATE user 
              SET name='$name', username='$username', password='$password', image=" . ($image ? "'$image'" : "NULL") . " 
              WHERE id='$id'";

    try {
        global $db;
        $db->exec($query);
        echo json_encode($user);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function deleteUser($id) {
    $query = "DELETE FROM user WHERE id = '$id'";
    try {
        global $db; 
        $db->exec($query);
        echo json_encode(['message' => "User with ID $id deleted successfully."]);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

?>