<?php

declare(strict_types=1);

namespace PaymentService\Services;

use PaymentService\Domain\PaymentStatus;
use PaymentService\Repositories\InMemoryPaymentRepository;

final class PaymentService
{
    public function __construct(private readonly InMemoryPaymentRepository $repository)
    {
    }

    public function createPayment(array $payload): array
    {
        $amount = (int) ($payload['amount'] ?? 0);
        $currency = (string) ($payload['currency'] ?? '');
        $orderId = trim((string) ($payload['orderId'] ?? ''));
        $description = trim((string) ($payload['description'] ?? ''));
        $customerId = trim((string) ($payload['customerId'] ?? ''));

        if ($amount <= 0 || $currency === '' || $orderId === '') {
            return $this->response(422, false, 'Dữ liệu tạo thanh toán không hợp lệ.', null);
        }

        $payment = [
            'id' => $this->generatePaymentId(),
            'orderId' => $orderId,
            'customerId' => $customerId,
            'description' => $description,
            'amount' => $amount,
            'currency' => strtoupper($currency),
            'status' => PaymentStatus::PENDING,
            'createdAt' => gmdate(DATE_ATOM),
            'updatedAt' => gmdate(DATE_ATOM),
        ];

        $created = $this->repository->create($payment);
        return $this->response(201, true, 'Tạo giao dịch thành công.', $created);
    }

    public function getPayment(string $paymentId): array
    {
        if ($paymentId === '') {
            return $this->response(400, false, 'Thiếu mã giao dịch.', null);
        }

        $payment = $this->repository->findById($paymentId);
        if ($payment === null) {
            return $this->response(404, false, 'Không tìm thấy giao dịch.', null);
        }

        return $this->response(200, true, 'Lấy giao dịch thành công.', $payment);
    }

    public function updatePaymentStatus(string $paymentId, array $payload): array
    {
        $nextStatus = strtolower(trim((string) ($payload['status'] ?? '')));
        if (!in_array($nextStatus, PaymentStatus::all(), true)) {
            return $this->response(422, false, 'Trạng thái giao dịch không hợp lệ.', null);
        }

        $payment = $this->repository->findById($paymentId);
        if ($payment === null) {
            return $this->response(404, false, 'Không tìm thấy giao dịch.', null);
        }

        $payment['status'] = $nextStatus;
        $payment['updatedAt'] = gmdate(DATE_ATOM);
        $updated = $this->repository->update($paymentId, $payment);

        return $this->response(200, true, 'Cập nhật trạng thái thành công.', $updated);
    }

    public function handleWebhook(array $payload, string $signature, string $rawBody): array
    {
        $webhookSecret = (string) ($_ENV['WEBHOOK_SECRET'] ?? '');
        if ($webhookSecret === '') {
            return $this->response(500, false, 'Thiếu cấu hình WEBHOOK_SECRET.', null);
        }

        $expectedSignature = hash_hmac('sha256', $rawBody, $webhookSecret);
        if (!hash_equals($expectedSignature, $signature)) {
            return $this->response(401, false, 'Webhook signature không hợp lệ.', null);
        }

        $paymentId = (string) ($payload['paymentId'] ?? '');
        $status = strtolower((string) ($payload['status'] ?? ''));
        if ($paymentId === '' || !in_array($status, PaymentStatus::all(), true)) {
            return $this->response(422, false, 'Payload webhook không hợp lệ.', null);
        }

        $payment = $this->repository->findById($paymentId);
        if ($payment === null) {
            return $this->response(404, false, 'Không tìm thấy giao dịch để xử lý webhook.', null);
        }

        $payment['status'] = $status;
        $payment['updatedAt'] = gmdate(DATE_ATOM);
        $this->repository->update($paymentId, $payment);

        return $this->response(200, true, 'Webhook đã được xử lý.', $payment);
    }

    private function generatePaymentId(): string
    {
        return 'pay_' . bin2hex(random_bytes(8));
    }

    private function response(int $status, bool $success, string $message, ?array $data): array
    {
        return [
            'status' => $status,
            'body' => [
                'success' => $success,
                'message' => $message,
                'data' => $data,
            ],
        ];
    }
}

