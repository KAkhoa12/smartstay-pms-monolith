import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CustomerRegisterDto {
  @ApiProperty({ example: 'customer@example.com' })
  email: string;

  @ApiProperty({ example: '123456' })
  password: string;

  @ApiProperty({ example: 'Customer Demo' })
  fullName: string;

  @ApiPropertyOptional({ example: '+84901234567' })
  phoneNumber?: string;
}
