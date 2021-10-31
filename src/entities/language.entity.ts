import { PrimaryColumn, Column, Entity } from 'typeorm';

@Entity('languages')
export class LanguageEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;
}
