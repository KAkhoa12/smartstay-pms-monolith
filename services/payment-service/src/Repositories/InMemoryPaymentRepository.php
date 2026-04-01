<?php

declare(strict_types=1);

namespace PaymentService\Repositories;

final class InMemoryPaymentRepository
{
    /** @var array<string, array<string, mixed>> */
    private static array $payments = [];

    public function create(array $payment): array
    {
        self::$payments[$payment['id']] = $payment;
        return $payment;
    }

    public function findById(string $id): ?array
    {
        return self::$payments[$id] ?? null;
    }

    public function update(string $id, array $payment): ?array
    {
        if (!isset(self::$payments[$id])) {
            return null;
        }

        self::$payments[$id] = $payment;
        return $payment;
    }
}

