package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"smartstay-pms-monolith/services/core-service/internal/config"
	httpDelivery "smartstay-pms-monolith/services/core-service/internal/delivery/http"
	"smartstay-pms-monolith/services/core-service/internal/repository/postgres"
	"smartstay-pms-monolith/services/core-service/internal/usecase"
	"smartstay-pms-monolith/services/core-service/pkg/database"
	"smartstay-pms-monolith/services/core-service/pkg/logger"

	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()
	_ = godotenv.Load(".env.local")

	configPath := os.Getenv("CONFIG_PATH")
	if configPath == "" {
		configPath = "configs/config.dev.yaml"
	}

	cfg, err := config.Load(configPath)
	if err != nil {
		log.Fatalf("load config failed: %v", err)
	}

	appLogger := logger.New()
	ctx := context.Background()

	pool, err := database.NewPostgresPool(ctx, cfg.Database)
	if err != nil {
		appLogger.Fatalf("connect postgres failed: %v", err)
	}
	defer pool.Close()

	userRepo := postgres.NewUserRepository(pool)
	refreshTokenRepo := postgres.NewRefreshTokenRepository(pool)
	authUC := usecase.NewAuthUsecase(userRepo, refreshTokenRepo, cfg.JWT, cfg.Secrets.JWTSecret)
	handler := httpDelivery.NewHandler(authUC)
	router := httpDelivery.NewRouter(handler)

	srv := &http.Server{
		Addr:         cfg.Server.Host + ":" + strconv.Itoa(cfg.Server.Port),
		Handler:      router,
		ReadTimeout:  cfg.Server.ReadTimeout,
		WriteTimeout: cfg.Server.WriteTimeout,
	}

	go func() {
		appLogger.Printf("%s running on %s", cfg.Server.Name, srv.Addr)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			appLogger.Fatalf("http server failed: %v", err)
		}
	}()

	waitForShutdown(appLogger, srv)
}

func waitForShutdown(logger *log.Logger, srv *http.Server) {
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		logger.Printf("graceful shutdown failed: %v", err)
	}
	logger.Printf("server stopped")
}
