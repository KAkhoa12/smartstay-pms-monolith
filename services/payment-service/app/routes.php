<?php

declare(strict_types=1);

/** @var \Slim\App $app */
/** @var \PaymentService\Controllers\PaymentController $paymentController */
/** @var \PaymentService\Controllers\HealthController $healthController */

$app->get('/healthz', [$healthController, 'healthz']);

$app->group('/api/v1', function ($group) use ($paymentController): void {
    $group->post('/payments', [$paymentController, 'createPayment']);
    $group->get('/payments/{id}', [$paymentController, 'getPayment']);
    $group->patch('/payments/{id}/status', [$paymentController, 'updatePaymentStatus']);
    $group->post('/payments/webhook', [$paymentController, 'handleWebhook']);
});

