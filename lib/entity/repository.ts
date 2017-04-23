import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import Suite from './suite'

@Entity()
export default class Repository {
  constructor({name: string}) {
    this.name = name
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @OneToMany(type => Suite, suite => suite.repository)
  suites: Suite[]
}
