import * as express from 'express';
import Controller from '../interfaces/controller.interfaces';
import townModel from './town.model';
import Town from './town.interface';
import cache from '../utils/cache';

class TownController implements Controller {
  public path = '/town';
  public router = express.Router();
  private town = townModel;

  constructor() {
    this.initializeRouters();
  }

  private initializeRouters() {
    this.router.get(this.path, this.getAllTowns);
    this.router.get(`${this.path}/:id`, this.getVillage);
    this.router.post(this.path, this.createTown);
    this.router.delete(`${this.path}/:id`, this.deleteTown);
  }

  /**
   * 获取所有城镇
   */
  private getAllTowns = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    this.town.find().populate('villages').then((towns: Town[]) => {
      res.send(towns);
    }).catch(err => {
      next(err);
    });
  }

  private getVillage = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id;
    this.town.findById(id).populate('villages').then((town: Town) => {
      res.send(town.villages);
    }).catch(err => {
      next(err);
    });
  }

  private createTown = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const townData: Town = req.body;
    const createTown = new this.town(townData);
    createTown.save().then(town => {
      res.send(town);
      cache.updateTown();
    }).catch(next);
  }

  private deleteTown = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id;
    this.town.findByIdAndDelete(id).then(success => {
      if (success) {
        res.send(200);
        cache.updateTown();
      } else {
        res.send(404);
      }
    }).catch(next);
  }
}

export default TownController;
