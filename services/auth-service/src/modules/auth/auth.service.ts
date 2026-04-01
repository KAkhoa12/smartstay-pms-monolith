import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from '../refresh-token/entities/refresh-token.entity';
import { JwtPayload } from './types/jwt-payload.type';
import { Tenant } from '../tenant/entities/tenant.entity';
import { Role } from '../role/entities/role.entity';
import { UserTenantRole } from '../user-tenant-role/entities/user-tenant-role.entity';
import { BusinessRegisterDto } from './dto/business-register.dto';
import { CustomerRegisterDto } from './dto/customer-register.dto';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const ACCOUNT_TYPE = {
  BUSINESS: 'BUSINESS',
  CUSTOMER: 'CUSTOMER',
} as const;

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
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(UserTenantRole)
    private readonly userTenantRoleRepo: Repository<UserTenantRole>,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async registerBusiness(body: BusinessRegisterDto) {
    const normalizedEmail = body.email.trim().toLowerCase();
    const existing = await this.userRepo.findOne({ where: { email: normalizedEmail } });
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    if (!body.companyName?.trim()) {
      throw new BadRequestException('Company name is required');
    }
    const normalizedDomain = await this.generateUniqueTenantDomain(body.domain, body.companyName);

    const passwordHash = await bcrypt.hash(body.password, 10);
    const savedUser = await this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const tenantRepo = manager.getRepository(Tenant);
      const roleRepo = manager.getRepository(Role);
      const userTenantRoleRepo = manager.getRepository(UserTenantRole);

      const user = new User();
      user.email = normalizedEmail;
      user.fullName = body.fullName.trim();
      user.passwordHash = passwordHash;
      user.phoneNumber = body.phoneNumber?.trim() || null;
      user.jobTitle = body.jobTitle?.trim() || null;
      user.accountType = ACCOUNT_TYPE.BUSINESS;
      user.status = 'ACTIVE';
      user.isGlobalAdmin = false;

      const createdUser = await userRepo.save(user);

      const tenant = new Tenant();
      tenant.name = body.companyName.trim();
      tenant.legalName = body.legalName?.trim() || body.companyName.trim();
      tenant.domain = normalizedDomain;
      tenant.businessType = body.businessType?.trim() || null;
      tenant.taxCode = body.taxCode?.trim() || null;
      tenant.contactEmail = normalizedEmail;
      tenant.contactPhone = body.phoneNumber?.trim() || null;
      tenant.websiteUrl = body.websiteUrl?.trim() || null;
      tenant.addressLine = body.addressLine?.trim() || null;
      tenant.city = body.city?.trim() || null;
      tenant.country = body.country?.trim() || null;
      tenant.companySize = body.companySize?.trim() || null;
      tenant.hotelCount = body.hotelCount && body.hotelCount > 0 ? body.hotelCount : 1;
      tenant.planType = 'FREE';
      tenant.status = 'ACTIVE';

      const createdTenant = await tenantRepo.save(tenant);

      const ownerRole = new Role();
      ownerRole.name = 'OWNER';
      ownerRole.tenantId = createdTenant.id;

      const createdRole = await roleRepo.save(ownerRole);

      const userTenantRole = new UserTenantRole();
      userTenantRole.userId = createdUser.id;
      userTenantRole.tenantId = createdTenant.id;
      userTenantRole.roleId = createdRole.id;

      await userTenantRoleRepo.save(userTenantRole);

      return createdUser;
    });
    const tokens = await this.issueTokens(savedUser);
    const memberships = await this.getUserMemberships(savedUser.id);

    return {
      user: this.toUserResponse(savedUser),
      memberships,
      ...tokens,
    };
  }

  async registerCustomer(body: CustomerRegisterDto) {
    const normalizedEmail = body.email.trim().toLowerCase();
    const existing = await this.userRepo.findOne({ where: { email: normalizedEmail } });
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = new User();
    user.email = normalizedEmail;
    user.fullName = body.fullName.trim();
    user.passwordHash = passwordHash;
    user.phoneNumber = body.phoneNumber?.trim() || null;
    user.jobTitle = null;
    user.accountType = ACCOUNT_TYPE.CUSTOMER;
    user.status = 'ACTIVE';
    user.isGlobalAdmin = false;

    const savedUser = await this.userRepo.save(user);
    const tokens = await this.issueTokens(savedUser);

    return {
      user: this.toUserResponse(savedUser),
      memberships: [],
      ...tokens,
    };
  }

  async loginBusiness(email: string, password: string, deviceInfo?: string, ipAddress?: string) {
    return this.loginByAccountType(email, password, ACCOUNT_TYPE.BUSINESS, deviceInfo, ipAddress);
  }

  async loginCustomer(email: string, password: string, deviceInfo?: string, ipAddress?: string) {
    return this.loginByAccountType(email, password, ACCOUNT_TYPE.CUSTOMER, deviceInfo, ipAddress);
  }

  private async loginByAccountType(
    email: string,
    password: string,
    accountType: string,
    deviceInfo?: string,
    ipAddress?: string,
  ) {
    const user = await this.userRepo.findOne({ where: { email: email.trim().toLowerCase() } });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.accountType !== accountType) {
      throw new UnauthorizedException('Account type is not allowed for this endpoint');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.issueTokens(user, deviceInfo, ipAddress);
    const memberships = await this.getUserMemberships(user.id);

    return {
      user: this.toUserResponse(user),
      memberships: user.accountType === ACCOUNT_TYPE.BUSINESS ? memberships : [],
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

    return {
      user: this.toUserResponse(user),
      memberships: await this.getUserMemberships(user.id),
    };
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
      phoneNumber: user.phoneNumber,
      jobTitle: user.jobTitle,
      accountType: user.accountType,
      status: user.status,
      isGlobalAdmin: user.isGlobalAdmin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private async getUserMemberships(userId: string) {
    const memberships = await this.userTenantRoleRepo.find({
      where: { userId },
      relations: ['tenant', 'role'],
    });

    return memberships.map((membership) => ({
      tenantId: membership.tenantId,
      roleId: membership.roleId,
      roleName: membership.role?.name ?? null,
      tenant: membership.tenant
        ? {
            id: membership.tenant.id,
            name: membership.tenant.name,
            legalName: membership.tenant.legalName,
            domain: membership.tenant.domain,
            businessType: membership.tenant.businessType,
            taxCode: membership.tenant.taxCode,
            contactEmail: membership.tenant.contactEmail,
            contactPhone: membership.tenant.contactPhone,
            websiteUrl: membership.tenant.websiteUrl,
            addressLine: membership.tenant.addressLine,
            city: membership.tenant.city,
            country: membership.tenant.country,
            companySize: membership.tenant.companySize,
            hotelCount: membership.tenant.hotelCount,
            planType: membership.tenant.planType,
            status: membership.tenant.status,
            createdAt: membership.tenant.createdAt,
            updatedAt: membership.tenant.updatedAt,
          }
        : null,
    }));
  }

  private async generateUniqueTenantDomain(rawDomain: string | undefined, companyName: string) {
    const source = rawDomain?.trim() || companyName.trim();
    const normalized = this.slugifyDomain(source);

    if (!normalized) {
      return null;
    }

    let candidate = normalized;
    let suffix = 1;

    while (await this.tenantRepo.findOne({ where: { domain: candidate } })) {
      suffix += 1;
      candidate = `${normalized}-${suffix}`;
    }

    return candidate;
  }

  private slugifyDomain(value: string) {
    return value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/.*$/, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 100);
  }
}
