import { hash as argon2Hash, verify as argon2Verify } from "@node-rs/argon2";
import { serverEnv } from "./env/serverEnv";

type VerifyPasswordType = {
  hash: string;
  password: string;
};

export const hashPasswordFunction = async (password: string) => {
  const hashedPassword = await argon2Hash(password, {
    secret: Buffer.from(serverEnv.BETTER_AUTH_SECRET),
  });

  return hashedPassword;
};

export const verifyPasswordFunction = async (data: VerifyPasswordType) => {
  const { hash, password } = data;

  const verifiedPassword = await argon2Verify(hash, password, {
    secret: Buffer.from(serverEnv.BETTER_AUTH_SECRET),
  });

  return verifiedPassword;
};
