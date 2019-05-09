import * as express from "express";
import * as path from "path";
import { ADMIN_PASSWORD, MONGODB_URI, SESSION_SECRET } from "./util/secrets";
import passport = require("passport");
import expressValidator = require("express-validator");
import mongoose = require("mongoose");
import bluebird = require("bluebird");
import session = require("express-session");
import bodyParser = require("body-parser");
import * as multer from "multer";
import * as xlsx from "node-xlsx";

// API keys and Passport configuration
import * as passportConfig from "./config/passport";
import * as captchaController from "./controllers/captcha";
import * as homeController from "./controllers/home";
// controller
import * as loginController from "./controllers/login";
import * as workerController from "./controllers/worker";
import * as excelController from "./controllers/excel";
import * as poorCellController from "./controllers/poorCell";
import * as settingsController from "./controllers/settings";
import Worker from "./models/worker";
import logger from "./util/logger";

logger.info("贫困人员就业调查系统启动");

const app = express();
// 指定上传文件目录
const storage = multer.memoryStorage()
const upload = multer({ dest: 'uploads/', storage: storage })

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;
mongoose.connect(mongoUrl, { useNewUrlParser: true }).then(
  () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch(err => {
  logger.info("MongoDB connection error. Please make sure MongoDB is running. " + err);
});

// 如果没有Admin用户新建Admin
Worker.findOne({username: "admin"}, (err, existOne) => {
  if (!existOne) {
    const worker = new Worker({
      username: "admin",
      password: ADMIN_PASSWORD
    });
    worker.save().then(() => {
      logger.info("初始化Admin完成");
    }).catch((err) => {
      if (err) {
        logger.error(err);
        process.exit(1);
      }
    });
  }
});

app.use(expressValidator());
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: SESSION_SECRET,
  cookie: { httpOnly: true, maxAge: 3600 * 1000}
}));
app.use(passport.initialize());
app.use(passport.session());
// 返回格式转换
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 设置当前用户
app.use((req, res, next) => {
  res.locals.worker = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
    req.path !== "/postLogin" &&
    req.path !== "/getCaptcha") {
    return res.status(401).json("请登陆");
  }
  next();
});

// 路由
app.get("/current", loginController.current)
app.get("/getCaptcha", captchaController.getCaptcha);
app.post("/postLogin", loginController.postLogin);
app.post("/postUpdate", passportConfig.isAuthenticated, workerController.postUpdate);
app.get("/logout", loginController.logout);
app.get("/workers", passportConfig.isAuthenticated, passportConfig.isAdmin, workerController.getWorkerList);
app.post("/postAddWorker", passportConfig.isAuthenticated, passportConfig.isAdmin, workerController.postAddWorker);
app.get("/delWorker", passportConfig.isAuthenticated, passportConfig.isAdmin, workerController.getDelWorker);
app.post("/updateWorker", passportConfig.isAuthenticated, passportConfig.isAdmin, workerController.postUpdateWorker);
app.post("/enterDb", passportConfig.isAuthenticated, excelController.enterDb);
app.post('/excel/upload', upload.single('excel'), excelController.parseExcel);
app.get("/poorCells", passportConfig.isAuthenticated, poorCellController.getPoorCells);
app.get("/delPoorCell", passportConfig.isAuthenticated, poorCellController.delPoorCell);
app.post("/updateAddr", passportConfig.isAdmin, settingsController.updateAdds);
app.get("/getAdds", passportConfig.isAdmin, settingsController.getAdds);
app.post("/postJobStateType", passportConfig.isAdmin, settingsController.postJobStateType);
app.get("/getJobStateType", passportConfig.isAdmin, settingsController.getJobStateType)
app.listen(3000);
