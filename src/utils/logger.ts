import { configure, getLogger } from "log4js";

configure({
  appenders: { main: { type: "file", filename: "/var/log/poor-invest/main.log" } },
  categories: { default: { appenders: ["main"], level: "info" } }
});

export default getLogger("main");
