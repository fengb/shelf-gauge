import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import Repository from './repository'

@Entity()
export default class Suite {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  ref: string

  @ManyToOne(type => Repository, repo => repo.suites)
  repository: Repository
}
