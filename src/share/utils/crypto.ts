import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(
  inputPassword: string,
  storedPassword: string
): boolean {
  const [salt, hash] = storedPassword.split(":");
  const inputHash = pbkdf2Sync(
    inputPassword,
    salt,
    1000,
    64,
    "sha512"
  ).toString("hex");
  return timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(inputHash, "hex")
  );
}

export function generateUUID() {
  const uuid = randomBytes(8);
  uuid[6] = (uuid[6] & 0x0f) | 0x40;
  uuid[8] = (uuid[8] & 0x3f) | 0x80;
  return uuid
    .toString("hex")
    .match(/.{1,8}/g)
    .join("-");
}
