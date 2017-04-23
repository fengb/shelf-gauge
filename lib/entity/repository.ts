import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export default class Repository {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string
}
