<?php

declare(strict_types=1);

namespace PaymentService\Domain;

final class PaymentStatus
{
    public const PENDING = 'pending';
    public const AUTHORIZED = 'authorized';
    public const PAID = 'paid';
    public const FAILED = 'failed';
    public const REFUNDED = 'refunded';
    public const CANCELLED = 'cancelled';

    public static function all(): array
    {
        return [
            self::PENDING,
            self::AUTHORIZED,
            self::PAID,
            self::FAILED,
            self::REFUNDED,
            self::CANCELLED,
        ];
    }
}

