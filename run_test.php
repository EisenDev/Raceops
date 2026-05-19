<?php
$users = [
    ['id' => 1, 'name' => 'Alice', 'roles' => ['editor', 'viewer'], 'active' => true],
    ['id' => 2, 'name' => 'Bob', 'roles' => ['viewer'], 'active' => false],
    ['id' => 3, 'name' => 'Charlie', 'roles' => ['admin', 'editor'], 'active' => true],
];

function checkPermissions($users, $requiredRole) {
    $authorized = [];
    foreach ($users as $user) {
        if ($user['active']) {
            foreach ($user['roles'] as $role) {
                if ($role === $requiredRole || $role === 'admin') {
                    $authorized[] = $user['name'];
                    break;
                }
            }
        }
    }
    
    sort($authorized);
    echo "AUTHORIZED FOR '{$requiredRole}':\n";
    foreach ($authorized as $name) {
        echo "- {$name}\n";
    }
}

checkPermissions($users, 'editor');
