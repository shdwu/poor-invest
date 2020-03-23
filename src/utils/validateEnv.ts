import { cleanEnv, str, port } from 'envalid'

export default function validateEnv() {
  cleanEnv(process.env, {
    MONGODB_URI: str(),
    SESSION_SECRET: str(),
    ADMIN_PASSWORD: str(),
    PORT: port(),
  })
}
