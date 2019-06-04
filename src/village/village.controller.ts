import villageModel from './village.model';
import townModel from '../town/town.model';
import * as express from 'express';
import Controller from '../interfaces/controller.interfaces';
import Village from './village.interface';

class VillageController implements Controller {
  public path = '/village';
  public router = express.Router();
  private village = villageModel;
  private town = townModel;

  constructor() {
    this.initializeRouters();
  }

  private initializeRouters() {
    this.router.post(`${this.path}`, this.createVillage);
    this.router.delete(`${this.path}/:id`, this.deleteVillage);
  }

  private createVillage = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const villageData = req.body;
    const createVillage = new this.village(villageData);
    createVillage.save().then((village: Village) => {
      res.send(village);
    }).catch(next);
  }

  private deleteVillage = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id;
    this.village.findByIdAndDelete(id).then(success => {
      if (success) {
        res.send(200);
      } else {
        res.send(404);
      }
    }).catch(next);
  }
}

export default VillageController;
