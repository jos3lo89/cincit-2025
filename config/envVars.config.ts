import { string, object, infer } from "zod";
const envVars = object({
  DATABASE_URL: string(),
  DIRECT_URL: string(),
});

envVars.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends infer<typeof envVars> {}
  }
}
