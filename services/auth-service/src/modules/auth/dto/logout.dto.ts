import { ApiProperty } from '@nestjs/swagger';

export class LogoutDto {
  @ApiProperty({ example: 'your_refresh_token_here' })
  refreshToken: string;
}
