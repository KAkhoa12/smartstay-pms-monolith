import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from '../refresh-token/entities/refresh-token.entity';
import { JwtPayload } from './types/jwt-payload.type';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly accessSecret = process.env.JWT_ACCESS_SECRET ?? 'access_secret';
  private readonly refreshSecret = process.env.JWT_REFRESH_SECRET ?? 'refresh_secret';
  private readonly accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN ?? '15m';
  private readonly refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN ?? '7d';

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string, fullName: string) {
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({
      email,
      fullName,
      passwordHash,
      status: 'ACTIVE',
      isGlobalAdmin: false,
    });

    const savedUser = await this.userRepo.save(user);
    const tokens = await this.issueTokens(savedUser);

    return {
      user: this.toUserResponse(savedUser),
      ...tokens,
    };
  }

  async login(email: string, password: string, deviceInfo?: string, ipAddress?: string) {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.issueTokens(user, deviceInfo, ipAddress);

    return {
      user: this.toUserResponse(user),
      ...tokens,
    };
  }

  async refresh(refreshToken: string, deviceInfo?: string, ipAddress?: string) {
    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    const user = await this.userRepo.findOne({ where: { id: payload.sub } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const activeTokens = await this.refreshTokenRepo.find({
      where: { userId: user.id, isRevoked: false },
      order: { createdAt: 'DESC' },
    });

    const matchedToken = await this.findMatchingToken(activeTokens, refreshToken);
    if (!matchedToken || matchedToken.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Refresh token expired or revoked');
    }

    matchedToken.isRevoked = true;
    await this.refreshTokenRepo.save(matchedToken);

    return this.issueTokens(user, deviceInfo, ipAddress);
  }

  async logout(refreshToken: string) {
    const activeTokens = await this.refreshTokenRepo.find({
      where: { isRevoked: false },
      order: { createdAt: 'DESC' },
    });

    const matchedToken = await this.findMatchingToken(activeTokens, refreshToken);
    if (matchedToken) {
      matchedToken.isRevoked = true;
      await this.refreshTokenRepo.save(matchedToken);
    }

    return { success: true };
  }

  async me(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.toUserResponse(user);
  }

  private async issueTokens(user: User, deviceInfo?: string, ipAddress?: string): Promise<AuthTokens> {
    const accessPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      type: 'access',
    };

    const refreshPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      type: 'refresh',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: this.accessSecret,
        expiresIn: this.accessExpiresIn as never,
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.refreshSecret,
        expiresIn: this.refreshExpiresIn as never,
      }),
    ]);

    const decoded = this.jwtService.decode(refreshToken) as { exp?: number } | null;
    const expiresAt = new Date(((decoded?.exp ?? 0) * 1000) || Date.now());

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    const tokenEntity = this.refreshTokenRepo.create({
      userId: user.id,
      tokenHash: refreshTokenHash,
      deviceInfo,
      ipAddress,
      isRevoked: false,
      expiresAt,
    });

    await this.refreshTokenRepo.save(tokenEntity);

    return { accessToken, refreshToken };
  }

  private async findMatchingToken(tokens: RefreshToken[], rawToken: string) {
    for (const token of tokens) {
      const matched = await bcrypt.compare(rawToken, token.tokenHash);
      if (matched) {
        return token;
      }
    }

    return null;
  }

  private toUserResponse(user: User) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      status: user.status,
      isGlobalAdmin: user.isGlobalAdmin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
