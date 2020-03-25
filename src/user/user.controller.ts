import * as express from 'express'
import Controller from '../interfaces/controller.interfaces'
import { User } from './user.interface'
import { userModel } from './user.model'
import HttpException from '../exceptions/HttpException'
import validationMiddleware from '../middleware/validation.middleware'
import { UserDto } from './user.dto'
import * as mongoose from 'mongoose'
import { NotEquals } from 'class-validator'

class UserController implements Controller {
  public path = '/user'
  public router = express.Router()
  private user = userModel

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllUser)
    this.router.get(`${this.path}/:id`, this.getUserById)
    this.router.post(`${this.path}/:id`, validationMiddleware(UserDto, true), this.updateUser)
    this.router.delete(`${this.path}/:id`, this.deleteUser)
    this.router.post(this.path, validationMiddleware(UserDto), this.createUser)
    this.router.post(`${this.path}/update-password`, this.updatePassword)
  }

  // 更新密码
  private updatePassword = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    req.assert('password', '密码长度至少为6位').len({ min: 6 })
    req.assert('confirmPassword', '两次输入不匹配').equals(req.body.password)

    const errors = req.validationErrors()

    if (errors) {
      res.send(errors.join(','))
    }

    this.user.findById(req.user.id, (err, ret) => {
      const user = ret as User & mongoose.Document
      if (err) { return next(err) }
      user.password = req.body.password
      user.save((err) => {
        if (err) { return res.status(400).send('更新密码失败') }
        res.send(200)
      })
    })
  }

  // 查询用户列表
  private getAllUser = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    this.user.find({ username: { $ne: 'admin' } }, '-password').populate('town').then(users => {
      res.send(users)
    }).catch(err => {
      next(new HttpException(400, err))
    })
  }

  private getUserById = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id
    this.user.findById(id, '-password').populate('town').then(user => {
      res.send(user)
    }).catch(err => {
      next(new HttpException(400, err))
    })
  }

  private updateUser = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let id = req.params.id
    if (id === 'current') {
      id = req.user.id
    }
    const userData: User = req.body
    userData.town = userData.town || null
    this.user.findByIdAndUpdate(id, userData, {new: true}).then(user => {
      res.send(user)
    }).catch(err => {
      next(new HttpException(400, err))
    })
  }

  private createUser = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const userData: User = req.body
    const createUser = new this.user(userData)
    createUser.save().then((user: User) => {
      res.send(user)
    }).catch((err: any) => {
      next(new HttpException(400, err))
    })
  }

  private deleteUser = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id
    this.user.findByIdAndDelete(id)
      .then( success => {
        if (success) {
          response.send(200)
        } else {
          response.send(404)
        }
      }).catch(err => {
        next(new HttpException(400, err))
      })
  }
}

export  { UserController }
