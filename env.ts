import * as dotenv from 'dotenv';

dotenv.config();

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env variable: ${name}`);
  }
  return value;
}

export const env = {
  BASIC_AUTH_USER: getEnv('BASIC_AUTH_USER'),
  BASIC_AUTH_PASS: getEnv('BASIC_AUTH_PASS'),
};