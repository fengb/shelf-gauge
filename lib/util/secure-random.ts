import * as crypto from 'crypto'

export const bytes = Promise.promisify(crypto.randomBytes)

export async function base64 (len: number) {
  const array = await bytes(len)
  return array.toString('base64').substr(0, len)
}
