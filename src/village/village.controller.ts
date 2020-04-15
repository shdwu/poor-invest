import * as express from 'express'
import Controller from '../interfaces/controller.interfaces'
import { Village } from './village.interface'
import { villageModel } from './village.model'
import { userModel, UserRole } from '../user'
import pinyin = require('pinyin')

class VillageController implements Controller {
  public path = '/village'
  public router = express.Router()
  private village = villageModel
  private user = userModel

  constructor() {
    this.initializeRouters()
  }

  private initializeRouters() {
    this.router.get(`${this.path}/byTownId/:id`, this.getVillagesByTownId)
    this.router.get(this.path, this.getAllVillage)
    this.router.get(`${this.path}/search`, this.searchByName)
    this.router.post(`${this.path}`, this.createVillage)
    this.router.post(`${this.path}/:id`, this.modifyVillage)
    this.router.delete(`${this.path}/:id`, this.deleteVillage)
  }

  private getVillagesByTownId = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const villages = await this.village.find({town: req.params.id})
    res.send(villages)
  }

  private getAllVillage = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let villages;
    if (req.user.town) {
      villages = await this.village.find({town: req.user.town})
    } else {
      villages = await this.village.find()
    }
    
    res.send(villages)
  }

  private searchByName = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.params.name) {
      const villages = await this.village.find({ name: req.params.name})
      res.send(villages)
    }
    res.send([])
  }

  private createVillage = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const villageData = req.body
    const createVillage = new this.village(villageData)
    createVillage.save().then((village: Village) => {
      res.send(village)
    })
  }

  private modifyVillage = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id
    const villageData = req.body
    this.village.findByIdAndUpdate( id, villageData).then(success => {
      if (success) {
        res.send(200)
      } else {
        res.send(404)
      }
    }).catch(next)
  }

  private deleteVillage = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id
    this.village.findByIdAndDelete(id).then(async (success) => {
      if (success) {
        await this.user.deleteMany({ village: { $eq: id} })
        res.send(200)
      } else {
        res.send(404)
      }
    }).catch(next)
  }
}

export { VillageController }
