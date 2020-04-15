import * as express from 'express'
import * as bodyParser from 'body-parser'
import mongoose = require('mongoose')
import * as bluebird from 'bluebird'
import session = require('express-session')
import redis = require('redis')
import * as passport from 'passport'
import expressValidator = require('express-validator')
import logger from './utils/logger'
import Controller from './interfaces/controller.interfaces'
import authMiddleware from './middleware/auth.middleware'
import errorMiddleware from './middleware/error.middleware'
import { userModel, UserRole } from './user'
import * as compression from 'compression'
import * as lusca from 'lusca'
import 'reflect-metadata'

class App {
  public app: express.Application

  constructor(controllers: Controller[]) {
    this.app = express()

    this.connectToDb()
    this.initializeMiddlewares()
    this.initializeControllers(controllers)
    this.initializeErrorHandling()
    this.initializeAdmin()
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      logger.info(`App listening on the port ${process.env.PORT}`)
    })
  }

  private initializeMiddlewares() {
    this.app.use(compression())
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(expressValidator())

    // redis
    const redisClient = redis.createClient()
    const redisStore = require('connect-redis')(session)

    this.app.use(session({
      resave: false,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET,
      cookie: { httpOnly: false, maxAge: 3600 * 1000},
      store: new redisStore({
        host: process.env.redisHost,
        port: process.env.redisPort,
        client: redisClient,
        ttl: process.env.redisTTL,
      }),
    }))

    this.app.use(passport.initialize())
    this.app.use(passport.session())
    this.app.use(lusca.xframe('SAMEORIGIN'))
    this.app.use(lusca.xssProtection(true))
    this.app.use((req, res, next) => {
      res.locals.user = req.user
      res.header('Cache-Control', 'no-store')
      next()
    })
    this.app.use(authMiddleware)
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware)
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router)
    })
  }

  // 如果没有 Admin 用户新建 Admin
  private initializeAdmin() {
    userModel.findOne({username: 'admin'}, (err, existOne) => {
      if (!existOne) {
        const user = new userModel({
          username: 'admin',
          roles: [ UserRole.AMDIN ],
          password: process.env.ADMIN_PASSWORD,
        })
        user.save().then(() => {
          logger.info('初始化Admin完成')
        }).catch( (err: any) => {
          if (err) {
            logger.error(err)
            process.exit(1)
          }
        })
      }
    })
  }

  private connectToDb() {
    const mongoUrl = process.env.MONGODB_URI
    mongoose.Promise = bluebird
    mongoose.connect(mongoUrl)
  }
}

export default App
