import logger from "./logger";
import dotenv = require("dotenv");
import fs = require("fs");

logger.info("加载配置文件");

if (fs.existsSync(".env")) {
    logger.info("Using .env file to supply config environment variables");
    dotenv.config({ path: ".env" });
}
export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === "production";

export const SESSION_SECRET = process.env["SESSION_SECRET"];
export const MONGODB_URI = process.env["MONGODB_URI"];
export const ADMIN_PASSWORD = process.env["ADMIN_PASSWORD"];

if (!SESSION_SECRET) {
    logger.error("No client secret. Set SESSION_SECRET environment variable.");
    process.exit(1);
}

if (!MONGODB_URI) {
    logger.error("No mongo connection string. Set MONGODB_URI environment variable.");
    process.exit(1);
}
