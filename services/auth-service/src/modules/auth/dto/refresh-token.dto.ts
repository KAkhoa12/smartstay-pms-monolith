import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ example: 'your_refresh_token_here' })
  refreshToken: string;

  @ApiPropertyOptional({ example: 'Chrome on Windows' })
  deviceInfo?: string;

  @ApiPropertyOptional({ example: '127.0.0.1' })
  ipAddress?: string;
}
