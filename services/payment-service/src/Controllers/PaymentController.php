<?php

declare(strict_types=1);

namespace PaymentService\Controllers;

use PaymentService\Services\PaymentService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class PaymentController
{
    public function __construct(private readonly PaymentService $paymentService)
    {
    }

    public function createPayment(Request $request, Response $response): Response
    {
        $payload = (array) $request->getParsedBody();
        $result = $this->paymentService->createPayment($payload);

        return $this->writeJson($response, $result['status'], $result['body']);
    }

    public function getPayment(Request $request, Response $response, array $args): Response
    {
        $paymentId = (string) ($args['id'] ?? '');
        $result = $this->paymentService->getPayment($paymentId);

        return $this->writeJson($response, $result['status'], $result['body']);
    }

    public function updatePaymentStatus(Request $request, Response $response, array $args): Response
    {
        $paymentId = (string) ($args['id'] ?? '');
        $payload = (array) $request->getParsedBody();
        $result = $this->paymentService->updatePaymentStatus($paymentId, $payload);

        return $this->writeJson($response, $result['status'], $result['body']);
    }

    public function handleWebhook(Request $request, Response $response): Response
    {
        $payload = (array) $request->getParsedBody();
        $signature = (string) ($request->getHeaderLine('X-Webhook-Signature') ?? '');
        $rawBody = (string) $request->getBody();
        $result = $this->paymentService->handleWebhook($payload, $signature, $rawBody);

        return $this->writeJson($response, $result['status'], $result['body']);
    }

    private function writeJson(Response $response, int $status, array $body): Response
    {
        $response->getBody()->write(json_encode($body, JSON_UNESCAPED_UNICODE));
        return $response->withStatus($status)->withHeader('Content-Type', 'application/json');
    }
}

