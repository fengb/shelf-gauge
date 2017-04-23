import { Context } from 'lib/server'
import Repository from 'lib/entity/repository'

export async function all (ctx: Context) {
  this.body = {}
}

export async function create (ctx: Context) {
  const name = `${ctx.params.org}/${ctx.params.name}`
  const repo = await ctx.conn.entityManager.findOne(Repository, { name })
}