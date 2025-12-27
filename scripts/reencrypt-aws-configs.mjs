#!/usr/bin/env node
import crypto from "crypto";
import { neon } from "@neondatabase/serverless";

function requireEnv(name) {
  const val = process.env[name];
  if (!val) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return val;
}

function deriveKey(key) {
  return crypto.createHash("sha256").update(String(key)).digest();
}

function encryptWithKey(key, text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

function decryptWithKey(key, text) {
  const parts = text.split(":");
  if (parts.length < 2) throw new Error("Invalid ciphertext format");
  const iv = Buffer.from(parts.shift(), "hex");
  const encryptedText = Buffer.from(parts.join(":"), "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString("utf8");
}

async function main() {
  const DATABASE_URL = requireEnv("DATABASE_URL");
  const OLD_ENCRYPTION_KEY = requireEnv("OLD_ENCRYPTION_KEY");
  const ENCRYPTION_KEY = requireEnv("ENCRYPTION_KEY");

  const oldKey = deriveKey(OLD_ENCRYPTION_KEY);
  const newKey = deriveKey(ENCRYPTION_KEY);

  const sql = neon(DATABASE_URL);

  console.log("Fetching awsConfigs...");
  const rows = await sql`select id, "awsAccessKeyId", "awsSecretAccessKey" from "awsConfigs"`;
  console.log(`Found ${rows.length} config(s).`);

  let updated = 0;
  for (const row of rows) {
    const { id, awsAccessKeyId, awsSecretAccessKey } = row;
    try {
      const plainAccess = decryptWithKey(oldKey, awsAccessKeyId);
      const plainSecret = decryptWithKey(oldKey, awsSecretAccessKey);

      const newAccess = encryptWithKey(newKey, plainAccess);
      const newSecret = encryptWithKey(newKey, plainSecret);

      await sql`
        update "awsConfigs"
        set "awsAccessKeyId" = ${newAccess},
            "awsSecretAccessKey" = ${newSecret},
            "updatedAt" = now()
        where id = ${id}
      `;
      updated += 1;
      console.log(`Re-encrypted config id=${id}`);
    } catch (err) {
      console.error(`Failed to re-encrypt config id=${id}:`, err.message);
      throw err;
    }
  }

  console.log(`Done. Re-encrypted ${updated} config(s).`);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
