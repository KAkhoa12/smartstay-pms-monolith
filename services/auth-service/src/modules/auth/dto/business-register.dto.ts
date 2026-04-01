import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BusinessRegisterDto {
  @ApiProperty({ example: 'admin@example.com' })
  email: string;

  @ApiProperty({ example: '123456' })
  password: string;

  @ApiProperty({ example: 'Admin User' })
  fullName: string;

  @ApiProperty({ example: 'SmartStay Hotel Group' })
  companyName: string;

  @ApiPropertyOptional({ example: 'SmartStay Hospitality Joint Stock Company' })
  legalName?: string;

  @ApiPropertyOptional({ example: 'hospitality' })
  businessType?: string;

  @ApiPropertyOptional({ example: '0123456789' })
  taxCode?: string;

  @ApiPropertyOptional({ example: '+84901234567' })
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'Operations Director' })
  jobTitle?: string;

  @ApiPropertyOptional({ example: 'https://smartstay.vn' })
  websiteUrl?: string;

  @ApiPropertyOptional({ example: '123 Nguyen Hue, District 1' })
  addressLine?: string;

  @ApiPropertyOptional({ example: 'Ho Chi Minh City' })
  city?: string;

  @ApiPropertyOptional({ example: 'Vietnam' })
  country?: string;

  @ApiPropertyOptional({ example: '11-50' })
  companySize?: string;

  @ApiPropertyOptional({ example: 3 })
  hotelCount?: number;

  @ApiPropertyOptional({ example: 'smartstay.vn' })
  domain?: string;
}
