<?php

declare(strict_types=1);

use Dotenv\Dotenv;
use PaymentService\Controllers\HealthController;
use PaymentService\Controllers\PaymentController;
use PaymentService\Repositories\InMemoryPaymentRepository;
use PaymentService\Services\PaymentService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$root = dirname(__DIR__);
if (file_exists($root . '/.env')) {
    Dotenv::createImmutable($root)->safeLoad();
}

$app = AppFactory::create();
$app->addBodyParsingMiddleware();

$repository = new InMemoryPaymentRepository();
$service = new PaymentService($repository);
$paymentController = new PaymentController($service);
$healthController = new HealthController();

require $root . '/app/routes.php';

$app->map(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], '/{routes:.+}', function (Request $request, Response $response): Response {
    $response->getBody()->write(json_encode([
        'success' => false,
        'message' => 'Route not found',
        'data' => null,
    ], JSON_UNESCAPED_UNICODE));

    return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
});

$app->run();
