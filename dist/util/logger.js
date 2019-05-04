"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log4js_1 = require("log4js");
log4js_1.configure({
    appenders: { main: { type: "file", filename: "/var/log/poor-invest/main.log" } },
    categories: { default: { appenders: ["main"], level: "info" } }
});
exports.default = log4js_1.getLogger("main");
//# sourceMappingURL=logger.js.map