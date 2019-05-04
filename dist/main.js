"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const passport = require("passport");
const expressValidator = require("express-validator");
const path = require("path");
const mongoose = require("mongoose");
const bluebird = require("bluebird");
const flash = require("express-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const secrets_1 = require("./util/secrets");
const logger_1 = require("./util/logger");
const worker_1 = require("./model/worker");
const loginController = require("./controller/login");
const captchaController = require("./controller/captcha");
const homeController = require("./controller/home");
const workerController = require("./controller/worker");
const passportConfig = require("./config/passport");
logger_1.default.info("贫困人员就业调查系统启动");
const app = express();
const mongoUrl = secrets_1.MONGODB_URI;
mongoose.Promise = bluebird;
mongoose.connect(mongoUrl, { useNewUrlParser: true }).then(() => { }).catch(err => {
    logger_1.default.info("MongoDB connection error. Please make sure MongoDB is running. " + err);
});
worker_1.default.findOne({ username: "admin" }, (err, existOne) => {
    if (!existOne) {
        const worker = new worker_1.default({
            username: "admin",
            password: secrets_1.ADMIN_PASSWORD
        });
        worker.save().then(() => {
            logger_1.default.info("初始化Admin完成");
        }).catch((err) => {
            if (err) {
                logger_1.default.error(err);
                process.exit(1);
            }
        });
    }
});
app.use(expressValidator());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: secrets_1.SESSION_SECRET,
    cookie: { httpOnly: true, maxAge: 3600 * 1000 }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"), { maxAge: 31557600000 }));
app.use((req, res, next) => {
    res.locals.worker = req.user;
    next();
});
app.use((req, res, next) => {
    if (!req.user &&
        req.path !== "/pc/login" &&
        req.path !== "/mobile/login" &&
        req.path !== "/captcha") {
        req.session.returnTo = req.path;
    }
    else if (req.user &&
        req.path == "/account") {
        req.session.returnTo = req.path;
    }
    next();
});
app.set("views", path.join(__dirname, "../view"));
app.set("view engine", "pug");
app.get("/captcha", captchaController.getCaptcha);
app.get("/mobile/", passportConfig.isAuthenticated, homeController.mobileIndex);
app.get("/mobile/login", loginController.mobileLogin);
app.get("/mobile/logout", loginController.mobileLogout);
app.post("/mobile/login", loginController.postLogin);
app.get("/pc/", passportConfig.isAuthenticated, homeController.pcIndex);
app.get("/pc/login", loginController.pcLogin);
app.get("/pc/logout", loginController.pcLogout);
app.post("/pc/login", loginController.postLogin);
app.get("/pc/worker", passportConfig.isAuthenticated, workerController.getWorker);
app.post("/pc/worker", passportConfig.isAuthenticated, workerController.postWorker);
app.post("/pc/worker/password", passportConfig.isAuthenticated, workerController.postUpdatePassword);
app.get("/pc/worker/list/:page", passportConfig.isAuthenticated, passportConfig.isAdmin, workerController.getWorkerList);
app.listen(3000);
//# sourceMappingURL=main.js.map