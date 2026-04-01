import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@example.com' })
  email: string;

  @ApiProperty({ example: '123456' })
  password: string;

  @ApiPropertyOptional({ example: 'Chrome on Windows' })
  deviceInfo?: string;

  @ApiPropertyOptional({ example: '127.0.0.1' })
  ipAddress?: string;
}
