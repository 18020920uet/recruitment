import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm';

import { UserEntity } from './user.entity';

@Entity()
export class CompanyEntity {
  // @AutoMap()
  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'owner_id' })
  owner: UserEntity;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  logo: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ nullable: true, name: 'phone_number' })
  phoneNumber: string;

  @Column({ default: '' })
  description: string;
}
