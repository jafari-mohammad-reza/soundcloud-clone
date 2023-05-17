import {pbkdf2Sync, randomBytes, timingSafeEqual} from "crypto"

export function hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex');
    const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
}

export function verifyPassword(inputPassword: string, storedPassword: string): boolean {
    const [salt, hash] = storedPassword.split(':');
    const inputHash = pbkdf2Sync(inputPassword, salt, 1000, 64, 'sha512').toString('hex');
    return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(inputHash, 'hex'));
}
