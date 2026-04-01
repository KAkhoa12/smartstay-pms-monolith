<?php

declare(strict_types=1);

namespace PaymentService\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class HealthController
{
    public function healthz(Request $request, Response $response): Response
    {
        $response->getBody()->write(json_encode([
            'success' => true,
            'message' => 'ok',
            'data' => [
                'service' => $_ENV['APP_NAME'] ?? 'smartstay-payment-service',
                'env' => $_ENV['APP_ENV'] ?? 'local',
            ],
        ], JSON_UNESCAPED_UNICODE));

        return $response->withHeader('Content-Type', 'application/json');
    }
}

