<?php
declare(strict_types=1);

// Roteador para o servidor local. Os arquivos públicos ficam em static/.
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

if ($path !== '/api/filmes') {
    return false;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
header('Content-Type: application/json; charset=utf-8');

if ($method !== 'GET' && $method !== 'HEAD') {
    header('Allow: GET, HEAD');
    http_response_code(405);
    echo '{"erro":"Método não permitido."}';
    return true;
}

$catalog = @file_get_contents(dirname(__DIR__) . '/dados/filmes.json');
if ($catalog === false) {
    http_response_code(500);
    $catalog = '{"erro":"Não foi possível carregar o catálogo."}';
}

header('Content-Length: ' . strlen($catalog));
if ($method === 'GET') {
    echo $catalog;
}
return true;
