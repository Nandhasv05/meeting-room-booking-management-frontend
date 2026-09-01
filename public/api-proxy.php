<?php
/**
 * Fallback proxy when Apache ProxyPass is not enabled.
 * Forwards /Meeting/api-proxy.php/<path> to Node at 127.0.0.1:5000/api/<path>
 */
declare(strict_types=1);

$targetBase = 'http://127.0.0.1:5000/api';
$path = '';
if (!empty($_GET['mh_path'])) {
    $path = (string) $_GET['mh_path'];
} elseif (!empty($_SERVER['PATH_INFO'])) {
    $path = (string) $_SERVER['PATH_INFO'];
} else {
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?: '';
    if (preg_match('#/api(?:-proxy\\.php)?/?(.*)$#', $uri, $m)) {
        $path = $m[1];
    }
}
$path = ltrim($path, '/');
$query = $_SERVER['QUERY_STRING'] ?? '';
$query = preg_replace('/(?:^|&)mh_path=[^&]*/', '', $query) ?? '';
$query = ltrim($query, '&');
$url = $targetBase . ($path !== '' ? '/' . $path : '');
if ($query !== '') {
    $url .= '?' . $query;
}

$headers = [];
foreach (['Authorization', 'Content-Type', 'Accept', 'X-Requested-With'] as $name) {
    $serverKey = 'HTTP_' . strtoupper(str_replace('-', '_', $name));
    if ($name === 'Content-Type' && !empty($_SERVER['CONTENT_TYPE'])) {
        $headers[] = 'Content-Type: ' . $_SERVER['CONTENT_TYPE'];
        continue;
    }
    if (!empty($_SERVER[$serverKey])) {
        $headers[] = $name . ': ' . $_SERVER[$serverKey];
    }
}

$body = file_get_contents('php://input');
$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_CUSTOMREQUEST => $_SERVER['REQUEST_METHOD'] ?? 'GET',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER => true,
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_POSTFIELDS => $body === false ? null : $body,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_CONNECTTIMEOUT => 5,
]);
$response = curl_exec($ch);
if ($response === false) {
    http_response_code(502);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => false, 'message' => 'Meeting Hall API is not running on port 5000.']);
    exit;
}
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
curl_close($ch);

$rawHeaders = substr($response, 0, $headerSize);
$rawBody = substr($response, $headerSize);
http_response_code((int) $status);
foreach (explode("\r\n", $rawHeaders) as $line) {
    if (stripos($line, 'Content-Type:') === 0 || stripos($line, 'Content-Disposition:') === 0) {
        header($line, true);
    }
}
echo $rawBody;
