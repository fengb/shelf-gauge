import * as crypto from "crypto";

export const bytes = Promise.promisify(crypto.randomBytes);

export async function base64(len: number) {
  // Base64 encodes each set of three bytes into four bytes.
  // So we only need to generate 3/4 of full random, rounded up
  const buffer = await bytes(Math.ceil(len * 3 / 4));
  return buffer.toString("base64").substr(0, len);
}

export async function hex(len: number) {
  const buffer = await bytes(Math.ceil(len / 2));
  return buffer.toString("hex").substr(0, len);
}
