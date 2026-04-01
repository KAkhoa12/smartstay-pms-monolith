import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserTenantRole } from '../../user-tenant-role/entities/user-tenant-role.entity';
import { Role } from '../../role/entities/role.entity';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ name: 'legal_name', type: 'varchar', length: 150, nullable: true })
  legalName: string | null;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  domain: string | null;

  @Column({ name: 'business_type', type: 'varchar', length: 100, nullable: true })
  businessType: string | null;

  @Column({ name: 'tax_code', type: 'varchar', length: 50, nullable: true })
  taxCode: string | null;

  @Column({ name: 'contact_email', type: 'varchar', length: 100, nullable: true })
  contactEmail: string | null;

  @Column({ name: 'contact_phone', type: 'varchar', length: 30, nullable: true })
  contactPhone: string | null;

  @Column({ name: 'website_url', type: 'varchar', length: 255, nullable: true })
  websiteUrl: string | null;

  @Column({ name: 'address_line', type: 'varchar', length: 255, nullable: true })
  addressLine: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string | null;

  @Column({ name: 'company_size', type: 'varchar', length: 50, nullable: true })
  companySize: string | null;

  @Column({ name: 'hotel_count', type: 'int', default: 1 })
  hotelCount: number;

  @Column({ name: 'plan_type', type: 'varchar', length: 50, default: 'FREE' })
  planType: string;

  @Column({ type: 'varchar', length: 20, default: 'ACTIVE' })
  status: string;

  @OneToMany(() => UserTenantRole, (utr) => utr.tenant)
  userTenantRoles: UserTenantRole[];

  @OneToMany(() => Role, (role) => role.tenant)
  customRoles: Role[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
