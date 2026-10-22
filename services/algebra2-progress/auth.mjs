import crypto from 'node:crypto';
import { promisify } from 'node:util';
const scrypt = promisify(crypto.scrypt);
const options = { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 };

export const token = () => crypto.randomBytes(32).toString('base64url');
export const tokenHash = value => crypto.createHash('sha256').update(value).digest('hex');
export async function passwordHash(password) {
  if (typeof password !== 'string' || password.length < 15 || password.length > 256) throw Error('Use a passphrase of 15–256 characters. Spaces are allowed; no character-composition rules apply.');
  const salt = crypto.randomBytes(16), key = await scrypt(password, salt, 64, options);
  return `scrypt$131072$8$1$${salt.toString('hex')}$${key.toString('hex')}`;
}
export function validPasswordHash(encoded) { return /^scrypt\$131072\$8\$1\$[a-f0-9]{32}\$[a-f0-9]{128}$/.test(encoded || ''); }
export async function verifyPassword(password, encoded) {
  if (!validPasswordHash(encoded) || typeof password !== 'string' || password.length > 256) return false;
  const [, , , , salt, expected] = encoded.split('$');
  const actual = await scrypt(password, Buffer.from(salt, 'hex'), 64, options);
  return crypto.timingSafeEqual(actual, Buffer.from(expected, 'hex'));
}
export class LoginLimiter {
  constructor({ attempts = 10, period = 15 * 60 * 1000, now = Date.now } = {}) { Object.assign(this, { attempts, period, now }); this.buckets = new Map(); }
  take(key) {
    const now = this.now();
    for (const [id, bucket] of this.buckets) if (bucket.until <= now) this.buckets.delete(id);
    if (this.buckets.size >= 10000 && !this.buckets.has(key)) return false;
    let bucket = this.buckets.get(key);
    if (!bucket) { bucket = { count: 0, until: now + this.period }; this.buckets.set(key, bucket); }
    return ++bucket.count <= this.attempts;
  }
}
