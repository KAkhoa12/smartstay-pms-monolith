package repository

import (
	"context"
	"time"

	"smartstay-pms-monolith/services/auth-service/internal/model"
)

type UserRepository interface {
	Create(ctx context.Context, user model.User) (model.User, error)
	FindByEmail(ctx context.Context, email string) (model.User, error)
}

type RefreshTokenRepository interface {
	Create(ctx context.Context, token model.RefreshToken) error
	RevokeAllByUser(ctx context.Context, userID string) error
	RevokeByTokenHash(ctx context.Context, tokenHash string) error
	IsValid(ctx context.Context, tokenHash string, now time.Time) (bool, error)
}
