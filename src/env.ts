import {z} from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string(),
  S3_ACCESS_KEY_ID: z.string(),
  S3_ENDPOINT: z.string().url(),
  S3_SECRET_ACCESS_KEY: z.string(),
  APP_PORT: z.string(),
});

export const env = envSchema.parse(process.env);