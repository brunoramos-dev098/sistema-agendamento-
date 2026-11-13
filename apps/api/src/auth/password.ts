import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
const derive = (senha: string, salt: string) =>
  new Promise<Buffer>((resolve, reject) =>
    scrypt(
      senha,
      salt,
      64,
      { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 },
      (err, key) => (err ? reject(err) : resolve(key)),
    ),
  );
export async function hashPassword(senha: string) {
  const salt = randomBytes(16).toString("hex");
  const key = await derive(senha, salt);
  return "scrypt$" + salt + "$" + key.toString("hex");
}
export async function verifyPassword(senha: string, hash: string) {
  const [method, salt, key] = hash.split("$");
  if (method !== "scrypt" || !salt || !key) return false;
  const actual = await derive(senha, salt);
  const expected = Buffer.from(key, "hex");
  return expected.length === actual.length && timingSafeEqual(actual, expected);
}
