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
        const updateTown = await this.town.findByIdAndUpdate(townData._id, townData)
        res.send(updateTown)
      } else {
        const addTown = await new this.town(townData).save()
        if (req.body.villages && IsArray(req.body.villages)) {
          req.body.villages.forEach(async (e: Village) => {
            e.town = addTown
            const vill = await new this.village(e).save()
            // 为乡镇初始化一个管理员账号
            const username = pinyin(vill.name.slice(0, 2), {style: pinyin.STYLE_NORMAL}).join('')
            new this.user({
              username,
              password: '123456',
              village: vill,
              roles: UserRole.NORMAL,
            }).save()
          })
        }
        res.send(addTown)
      }
    } catch (err) {
      next(new HttpException(400, '命名重复'))
    }
  }
}
