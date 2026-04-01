import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from '../refresh-token/entities/refresh-token.entity';
import { Tenant } from '../tenant/entities/tenant.entity';
import { Role } from '../role/entities/role.entity';
import { UserTenantRole } from '../user-tenant-role/entities/user-tenant-role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken, Tenant, Role, UserTenantRole]),
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
