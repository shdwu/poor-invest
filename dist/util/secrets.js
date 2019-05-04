"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const dotenv = require("dotenv");
const fs = require("fs");
logger_1.default.info("加载配置文件");
if (fs.existsSync(".env")) {
    logger_1.default.info("Using .env file to supply config environment variables");
    dotenv.config({ path: ".env" });
}
exports.ENVIRONMENT = process.env.NODE_ENV;
const prod = exports.ENVIRONMENT === "production";
exports.SESSION_SECRET = process.env["SESSION_SECRET"];
exports.MONGODB_URI = process.env["MONGODB_URI"];
exports.ADMIN_PASSWORD = process.env["ADMIN_PASSWORD"];
if (!exports.SESSION_SECRET) {
    logger_1.default.error("No client secret. Set SESSION_SECRET environment variable.");
    process.exit(1);
}
if (!exports.MONGODB_URI) {
    logger_1.default.error("No mongo connection string. Set MONGODB_URI environment variable.");
    process.exit(1);
}
//# sourceMappingURL=secrets.js.map