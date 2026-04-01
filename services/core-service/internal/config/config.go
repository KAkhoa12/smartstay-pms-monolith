package config

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"gopkg.in/yaml.v3"
)

type Config struct {
	Env      string         `yaml:"env"`
	Server   ServerConfig   `yaml:"server"`
	Database DatabaseConfig `yaml:"database"`
	JWT      JWTConfig      `yaml:"jwt"`
	Secrets  SecretsConfig
}

type ServerConfig struct {
	Name         string        `yaml:"name"`
	Host         string        `yaml:"host"`
	Port         int           `yaml:"port"`
	ReadTimeout  time.Duration `yaml:"read_timeout"`
	WriteTimeout time.Duration `yaml:"write_timeout"`
}

type DatabaseConfig struct {
	Host         string        `yaml:"host"`
	Port         int           `yaml:"port"`
	User         string        `yaml:"user"`
	Password     string        `yaml:"password"`
	DBName       string        `yaml:"db_name"`
	SSLMode      string        `yaml:"ssl_mode"`
	MaxOpenConns int32         `yaml:"max_open_conns"`
	MaxIdleConns int32         `yaml:"max_idle_conns"`
	MaxLifetime  time.Duration `yaml:"max_lifetime"`
}

type JWTConfig struct {
	Issuer     string        `yaml:"issuer"`
	AccessTTL  time.Duration `yaml:"access_ttl"`
	RefreshTTL time.Duration `yaml:"refresh_ttl"`
}

type SecretsConfig struct {
	JWTSecret string
}

func Load(path string) (Config, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return Config{}, fmt.Errorf("read config file: %w", err)
	}

	var cfg Config
	if err := yaml.Unmarshal(data, &cfg); err != nil {
		return Config{}, fmt.Errorf("parse yaml: %w", err)
	}

	applyEnvOverrides(&cfg)
	if err := validate(cfg); err != nil {
		return Config{}, err
	}

	return cfg, nil
}

func applyEnvOverrides(cfg *Config) {
	if env := os.Getenv("APP_ENV"); env != "" {
		cfg.Env = env
	}
	if host := os.Getenv("DB_HOST"); host != "" {
		cfg.Database.Host = host
	}
	if port := os.Getenv("DB_PORT"); port != "" {
		if v, err := strconv.Atoi(port); err == nil {
			cfg.Database.Port = v
		}
	}
	if user := os.Getenv("DB_USER"); user != "" {
		cfg.Database.User = user
	}
	if pass := os.Getenv("DB_PASSWORD"); pass != "" {
		cfg.Database.Password = pass
	}
	if name := os.Getenv("DB_NAME"); name != "" {
		cfg.Database.DBName = name
	}
	if ssl := os.Getenv("DB_SSL_MODE"); ssl != "" {
		cfg.Database.SSLMode = ssl
	}
	cfg.Secrets.JWTSecret = os.Getenv("JWT_SECRET")
}

func validate(cfg Config) error {
	if cfg.Server.Port == 0 {
		return fmt.Errorf("server.port is required")
	}
	if cfg.Database.Host == "" || cfg.Database.User == "" || cfg.Database.DBName == "" {
		return fmt.Errorf("database config is incomplete")
	}
	if cfg.Secrets.JWTSecret == "" {
		return fmt.Errorf("JWT_SECRET is required")
	}
	if cfg.JWT.AccessTTL <= 0 || cfg.JWT.RefreshTTL <= 0 {
		return fmt.Errorf("jwt access_ttl and refresh_ttl must be > 0")
	}
	return nil
}
