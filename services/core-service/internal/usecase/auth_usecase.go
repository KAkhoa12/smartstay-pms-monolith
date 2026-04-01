package usecase

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"time"

	"smartstay-pms-monolith/services/auth-service/internal/config"
	"smartstay-pms-monolith/services/auth-service/internal/model"
	"smartstay-pms-monolith/services/auth-service/internal/repository"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrEmailExists        = errors.New("email already exists")
	ErrInvalidCredentials = errors.New("invalid credentials")
)

type AuthUsecase struct {
	users        repository.UserRepository
	refreshToken repository.RefreshTokenRepository
	jwtCfg       config.JWTConfig
	jwtSecret    []byte
}

type RegisterInput struct {
	Email    string
	Password string
	FullName string
}

type LoginInput struct {
	Email    string
	Password string
}

func NewAuthUsecase(users repository.UserRepository, refreshToken repository.RefreshTokenRepository, jwtCfg config.JWTConfig, jwtSecret string) *AuthUsecase {
	return &AuthUsecase{
		users:        users,
		refreshToken: refreshToken,
		jwtCfg:       jwtCfg,
		jwtSecret:    []byte(jwtSecret),
	}
}

func (u *AuthUsecase) Register(ctx context.Context, in RegisterInput) (model.User, model.TokenPair, error) {
	if in.Email == "" || in.Password == "" {
		return model.User{}, model.TokenPair{}, errors.New("email and password are required")
	}

	if _, err := u.users.FindByEmail(ctx, in.Email); err == nil {
		return model.User{}, model.TokenPair{}, ErrEmailExists
	} else if !errors.Is(err, pgx.ErrNoRows) {
		return model.User{}, model.TokenPair{}, fmt.Errorf("check existing email: %w", err)
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(in.Password), bcrypt.DefaultCost)
	if err != nil {
		return model.User{}, model.TokenPair{}, fmt.Errorf("hash password: %w", err)
	}

	created, err := u.users.Create(ctx, model.User{
		ID:           uuid.NewString(),
		Email:        in.Email,
		PasswordHash: string(hash),
		FullName:     in.FullName,
		Status:       "active",
	})
	if err != nil {
		return model.User{}, model.TokenPair{}, err
	}

	tokens, err := u.createTokenPair(ctx, created.ID)
	if err != nil {
		return model.User{}, model.TokenPair{}, err
	}

	return created, tokens, nil
}

func (u *AuthUsecase) Login(ctx context.Context, in LoginInput) (model.User, model.TokenPair, error) {
	user, err := u.users.FindByEmail(ctx, in.Email)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return model.User{}, model.TokenPair{}, ErrInvalidCredentials
		}
		return model.User{}, model.TokenPair{}, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(in.Password)); err != nil {
		return model.User{}, model.TokenPair{}, ErrInvalidCredentials
	}

	if err := u.refreshToken.RevokeAllByUser(ctx, user.ID); err != nil {
		return model.User{}, model.TokenPair{}, err
	}

	tokens, err := u.createTokenPair(ctx, user.ID)
	if err != nil {
		return model.User{}, model.TokenPair{}, err
	}

	return user, tokens, nil
}

func (u *AuthUsecase) createTokenPair(ctx context.Context, userID string) (model.TokenPair, error) {
	now := time.Now()
	accessExp := now.Add(u.jwtCfg.AccessTTL)
	refreshExp := now.Add(u.jwtCfg.RefreshTTL)

	accessToken, err := u.signJWT(userID, "access", accessExp)
	if err != nil {
		return model.TokenPair{}, err
	}

	refreshToken, err := u.signJWT(userID, "refresh", refreshExp)
	if err != nil {
		return model.TokenPair{}, err
	}

	refreshHash := hashToken(refreshToken)
	if err := u.refreshToken.Create(ctx, model.RefreshToken{
		ID:        uuid.NewString(),
		UserID:    userID,
		TokenHash: refreshHash,
		ExpiresAt: refreshExp,
	}); err != nil {
		return model.TokenPair{}, err
	}

	return model.TokenPair{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		TokenType:    "Bearer",
		ExpiresIn:    int64(u.jwtCfg.AccessTTL.Seconds()),
	}, nil
}

func (u *AuthUsecase) signJWT(userID, tokenType string, exp time.Time) (string, error) {
	claims := jwt.MapClaims{
		"sub": userID,
		"iss": u.jwtCfg.Issuer,
		"typ": tokenType,
		"iat": time.Now().Unix(),
		"exp": exp.Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString(u.jwtSecret)
	if err != nil {
		return "", fmt.Errorf("sign jwt: %w", err)
	}
	return signed, nil
}

func hashToken(token string) string {
	sum := sha256.Sum256([]byte(token))
	return hex.EncodeToString(sum[:])
}
