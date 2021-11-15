import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm';

import { UserEntity } from './user.entity';

@Entity('business_fields')
export class BusinessFieldEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;
}


// Finance, Sales and Marketing, Information Technology, Design, Communications, Real Estate
// Human Resources, Training and Development, Public Relations, Management, Accounting, Health Services
