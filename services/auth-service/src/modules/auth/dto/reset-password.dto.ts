import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'customer@example.com' })
  email: string;

  @ApiProperty({ example: '123456' })
  otp: string;

  @ApiProperty({ example: 'newStrongPassword123' })
  newPassword: string;
}
