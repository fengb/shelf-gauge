import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class Repository {
  @PrimaryGeneratedColumn()
  id: number

  @Column('string')
  name: string
}
