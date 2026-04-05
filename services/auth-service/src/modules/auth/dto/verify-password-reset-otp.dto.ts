import { ApiProperty } from '@nestjs/swagger';

export class VerifyPasswordResetOtpDto {
  @ApiProperty({ example: 'customer@example.com' })
  email: string;

  @ApiProperty({ example: '123456' })
  otp: string;
}
