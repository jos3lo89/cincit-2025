import { string, object, infer } from "zod";
const envVars = object({
  DATABASE_URL: string(),
  // DIRECT_URL: string(),
  AUTH_SECRET: string(),
  EMAIL_USER: string(),
  EMAIL_PASS: string(),
  EMAIL_HOST: string(),
  EMAIL_PORT: string(),
  JWT_SECRET: string(),
  NODE_ENV: string(),
  PURPOSE_REGISTER: string(),
  REGISTER_COOKIE_NAME: string(),
  SUPABASE_BUCKET_NAME: string(),
  NEXT_PUBLIC_SUPABASE_URL: string(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string(),
});

envVars.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends infer<typeof envVars> {}
  }
}
