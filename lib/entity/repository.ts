import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export default class Repository {
  constructor({name: string}) {
    this.name = name
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string
}
