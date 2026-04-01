import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserTenantRole } from '../../user-tenant-role/entities/user-tenant-role.entity';
import { RefreshToken } from '../../refresh-token/entities/refresh-token.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ name: 'full_name', type: 'varchar', length: 100 })
  fullName: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 30, nullable: true })
  phoneNumber: string | null;

  @Column({ name: 'job_title', type: 'varchar', length: 100, nullable: true })
  jobTitle: string | null;

  @Column({ name: 'account_type', type: 'varchar', length: 20, default: 'CUSTOMER' })
  accountType: string;

  @Column({ name: 'is_global_admin', default: false })
  isGlobalAdmin: boolean;

  @Column({ type: 'varchar', length: 20, default: 'ACTIVE' })
  status: string;

  @OneToMany(() => UserTenantRole, (utr) => utr.user)
  userTenantRoles: UserTenantRole[];

  @OneToMany(() => RefreshToken, (rt) => rt.user)
  refreshTokens: RefreshToken[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
