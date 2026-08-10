<?php
// Application Password verification — the API-key layer any AI agent uses.
// This is deliberately separate from the human admin login in admin/.

require_once __DIR__ . '/config.php';

/** Pulls the raw Application Password out of the request, however it was sent. */
function currentToken(): ?string {
    $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
    if ($hdr && preg_match('/Bearer\s+(\S+)/i', $hdr, $m)) {
        return $m[1];
    }
    // Also accept HTTP Basic Auth: any-username : <token>
    if (!empty($_SERVER['PHP_AUTH_PW'])) {
        return $_SERVER['PHP_AUTH_PW'];
    }
    return null;
}

/** True if the given raw token matches a live (non-revoked) Application Password. */
function tokenIsValid(string $token): bool {
    $stmt = db()->query('SELECT token_hash FROM tokens WHERE revoked = 0');
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        if (password_verify($token, $row['token_hash'])) {
            return true;
        }
    }
    return false;
}

/** Call at the top of any endpoint that must not be publicly writable. Exits with 401 if unauthorized. */
function requireAuth(): void {
    $token = currentToken();
    if (!$token || !tokenIsValid($token)) {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode([
            'error' => 'Missing or invalid Application Password. Send: Authorization: Bearer <token>',
        ]);
        exit;
    }
}
