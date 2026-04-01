package postgres

import (
	"context"
	"fmt"
	"time"

	"smartstay-pms-monolith/services/auth-service/internal/model"

	"github.com/jackc/pgx/v5/pgxpool"
)

type RefreshTokenRepository struct {
	pool *pgxpool.Pool
}

func NewRefreshTokenRepository(pool *pgxpool.Pool) *RefreshTokenRepository {
	return &RefreshTokenRepository{pool: pool}
}

func (r *RefreshTokenRepository) Create(ctx context.Context, token model.RefreshToken) error {
	const query = `
		INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at)
		VALUES ($1, $2, $3, $4)
	`

	if _, err := r.pool.Exec(ctx, query, token.ID, token.UserID, token.TokenHash, token.ExpiresAt); err != nil {
		return fmt.Errorf("create refresh token: %w", err)
	}

	return nil
}

func (r *RefreshTokenRepository) RevokeAllByUser(ctx context.Context, userID string) error {
	const query = `
		UPDATE refresh_tokens
		SET revoked_at = NOW()
		WHERE user_id = $1 AND revoked_at IS NULL
	`

	if _, err := r.pool.Exec(ctx, query, userID); err != nil {
		return fmt.Errorf("revoke refresh tokens by user: %w", err)
	}

	return nil
}

func (r *RefreshTokenRepository) RevokeByTokenHash(ctx context.Context, tokenHash string) error {
	const query = `
		UPDATE refresh_tokens
		SET revoked_at = NOW()
		WHERE token_hash = $1 AND revoked_at IS NULL
	`

	if _, err := r.pool.Exec(ctx, query, tokenHash); err != nil {
		return fmt.Errorf("revoke refresh token: %w", err)
	}

	return nil
}

func (r *RefreshTokenRepository) IsValid(ctx context.Context, tokenHash string, now time.Time) (bool, error) {
	const query = `
		SELECT EXISTS (
			SELECT 1
			FROM refresh_tokens
			WHERE token_hash = $1
			  AND revoked_at IS NULL
			  AND expires_at > $2
		)
	`

	var exists bool
	if err := r.pool.QueryRow(ctx, query, tokenHash, now).Scan(&exists); err != nil {
		return false, fmt.Errorf("check refresh token validity: %w", err)
	}

	return exists, nil
}
