import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm';
import { AutoMap } from '@automapper/classes';

import { CompanyEntity } from './company.entity';

@Entity('information_of_companies')
export class CompanyInformationEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Addresses: address-1|address-2|address-3
  @AutoMap()
  @Column()
  addresses: string;

  @AutoMap()
  @Column({ nullable: true, name: 'phone_number' })
  phoneNumber: string;

  @AutoMap()
  @Column({ nullable: true, name: 'pax_number' })
  paxNumber: string;

  @AutoMap()
  @Column({ type: 'varchar', default: '' })
  description: string;

  // Photos: photo-code-1|photo-code-2|photo-code-3
  @AutoMap()
  @Column({ default: '' })
  photos: string;

  // Only company employees
  @AutoMap()
  @Column({ default: 1, name: 'number_of_employees' })
  numberOfEmployees: number;

  // { facebook: '', linkedin: '', website: '', .... }
  @AutoMap()
  @Column({ type: 'jsonb', nullable: true, name: 'social_networks' })
  socialNetworks: Record<string, unknown>;

  @OneToOne(() => CompanyEntity, (company) => company.information, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'id' }])
  company: CompanyEntity;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ name: 'date_of_establishment' })
  dateOfEstablishment: string;
}
