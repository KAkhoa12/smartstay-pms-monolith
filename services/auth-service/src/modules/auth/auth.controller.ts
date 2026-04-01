import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { buildApiResponse } from '../../common/api-response';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { BusinessRegisterDto } from './dto/business-register.dto';
import { CustomerRegisterDto } from './dto/customer-register.dto';

interface JwtRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/business')
  async registerBusiness(@Body() body: BusinessRegisterDto) {
    const payload = await this.authService.registerBusiness(body);
    return buildApiResponse(true, 'Business register successful', payload);
  }

  @Post('register/customer')
  async registerCustomer(@Body() body: CustomerRegisterDto) {
    const payload = await this.authService.registerCustomer(body);
    return buildApiResponse(true, 'Customer register successful', payload);
  }

  @Post('login/business')
  async loginBusiness(@Body() body: LoginDto) {
    const payload = await this.authService.loginBusiness(body.email, body.password, body.deviceInfo, body.ipAddress);
    return buildApiResponse(true, 'Business login successful', payload);
  }

  @Post('login/customer')
  async loginCustomer(@Body() body: LoginDto) {
    const payload = await this.authService.loginCustomer(body.email, body.password, body.deviceInfo, body.ipAddress);
    return buildApiResponse(true, 'Customer login successful', payload);
  }

  @Post('refresh')
  async refresh(@Body() body: RefreshTokenDto) {
    const payload = await this.authService.refresh(body.refreshToken, body.deviceInfo, body.ipAddress);
    return buildApiResponse(true, 'Refresh token successful', payload);
  }

  @Post('logout')
  async logout(@Body() body: LogoutDto) {
    const payload = await this.authService.logout(body.refreshToken);
    return buildApiResponse(true, 'Logout successful', payload);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: JwtRequest) {
    const payload = await this.authService.me(req.user.userId);
    return buildApiResponse(true, 'Get profile successful', payload);
  }
}
