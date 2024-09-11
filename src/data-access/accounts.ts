const ITERATIONS = 10000;

import crypto from "crypto";

async function hashPassword(plainTextPassword: string, salt: string) {
  return new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(
      plainTextPassword,
      salt,
      ITERATIONS,
      64,
      "sha512",
      (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString("hex"));
      }
    );
  });
}

// export async function createAccount(userId: UserId, password: string) {
//     const salt = crypto.randomBytes(128).toString("base64");
//     const hash = await hashPassword(password, salt);
//     const [account] = await database
//       .insert(accounts)
//       .values({
//         userId,
//         accountType: "email",
//         password: hash,
//         salt,
//       })
//       .returning();
//     return account;
//   }
