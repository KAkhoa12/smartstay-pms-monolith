import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserTenantRole } from '../../user-tenant-role/entities/user-tenant-role.entity';
import { Role } from '../../role/entities/role.entity';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  domain: string;

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
