import * as express from 'express'
import Controller from '../interfaces/controller.interfaces'
import { townModel } from './town.model'
import { Town } from './town.interface'
import { villageModel, Village } from '../village'
import { IsArray } from 'class-validator'
import HttpException from '../exceptions/HttpException'
import { userModel, UserRole } from '../user'
import pinyin = require('pinyin')

export class TownController implements Controller {
  public path = '/town'
  public router = express.Router()
  private town = townModel
  private village = villageModel
  private user = userModel

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAll)
    this.router.post(this.path, this.addOrUpdate)
    this.router.delete(`${this.path}/:id`, this.del)
  }

  private del = (req: express.Request, res: express.Response) => {
    const id = req.params.id
    this.town.findByIdAndDelete(id).then(success => {
      res.send()
    })
  }

  private getAll = (req: express.Request, res: express.Response) => {
    this.town.find().then(towns => {
      res.send(towns)
    })
  }

  private addOrUpdate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const townData: Town = req.body
    try {
      if (townData._id) {
        const updateTown = await this.town.findByIdAndUpdate(townData._id, { name: townData.name})
        res.send(updateTown)
      } else {
        const addTown = await new this.town({ name: townData.name }).save()
        if (req.body.villages && IsArray(req.body.villages)) {
          req.body.villages.forEach(async (e: Village) => {
            e.town = addTown
            const vill = await new this.village(e).save()
          })
        }
        res.send(addTown)
        // 为乡镇初始化一个管理员账号
        const username = pinyin(addTown.name.slice(0, 2), {style: pinyin.STYLE_NORMAL}).join('')
        new this.user({
          username,
          password: '123456',
          town: addTown,
          roles: UserRole.NORMAL,
        }).save()
      }
    } catch (err) {
      next(new HttpException(400, '命名重复'))
    }
  }
}
