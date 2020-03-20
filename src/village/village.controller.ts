import * as express from 'express'
import Controller from '../interfaces/controller.interfaces'
import cache from '../utils/cache'
import Village from './village.interface'
import villageModel from './village.model'

class VillageController implements Controller {
  public path = '/village'
  public router = express.Router()
  private village = villageModel

  constructor() {
    this.initializeRouters()
  }

  private initializeRouters() {
    this.router.post(`${this.path}`, this.createVillage)
    this.router.delete(`${this.path}/:id`, this.deleteVillage)
  }

  private createVillage = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const villageData = req.body
    const createVillage = new this.village(villageData)
    createVillage.save().then((village: Village) => {
      res.send(village)
    }).catch(next)
    cache.updateTown()
  }

  private deleteVillage = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id
    this.village.findByIdAndDelete(id).then(success => {
      if (success) {
        res.send(200)
      } else {
        res.send(404)
      }
    }).catch(next)
    cache.updateTown()
  }
}

export default VillageController
