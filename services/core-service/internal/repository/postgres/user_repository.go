package postgres

import (
	"context"
	"errors"
	"fmt"

	"smartstay-pms-monolith/services/auth-service/internal/model"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserRepository struct {
	pool *pgxpool.Pool
}

func NewUserRepository(pool *pgxpool.Pool) *UserRepository {
	return &UserRepository{pool: pool}
}

func (r *UserRepository) Create(ctx context.Context, user model.User) (model.User, error) {
	const query = `
		INSERT INTO users (id, email, password_hash, full_name, status)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, email, password_hash, full_name, status, created_at, updated_at
	`

	var out model.User
	err := r.pool.QueryRow(ctx, query, user.ID, user.Email, user.PasswordHash, user.FullName, user.Status).Scan(
		&out.ID,
		&out.Email,
		&out.PasswordHash,
		&out.FullName,
		&out.Status,
		&out.CreatedAt,
		&out.UpdatedAt,
	)
	if err != nil {
		return model.User{}, fmt.Errorf("create user: %w", err)
	}

	return out, nil
}

func (r *UserRepository) FindByEmail(ctx context.Context, email string) (model.User, error) {
	const query = `
		SELECT id, email, password_hash, full_name, status, created_at, updated_at
		FROM users
		WHERE email = $1
	`

	var user model.User
	err := r.pool.QueryRow(ctx, query, email).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.FullName,
		&user.Status,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return model.User{}, pgx.ErrNoRows
		}
		return model.User{}, fmt.Errorf("find user by email: %w", err)
	}

	return user, nil
}
