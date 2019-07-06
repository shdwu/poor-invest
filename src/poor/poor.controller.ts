import Controller from '../interfaces/controller.interfaces';
import * as express from 'express';
import poorModel from './poor.model';
import validateMiddleware from '../middleware/validation.middleware';
import CreatePoorDto from './poor.dto';

class PoorController implements Controller {
  public path = '/poor';
  public router = express.Router();
  private poor = poorModel;

  constructor() {
    this.initializeRouters();
  }

  private initializeRouters() {
    this.router.get(this.path, this.getPoors);
    this.router.get(`${this.path}/cellers`, this.getCellers);
    this.router.get(`${this.path}/search`, this.searchPoors);
    this.router.get(`${this.path}/:id`, this.getPoorById);
    this.router.post(`${this.path}`, validateMiddleware(CreatePoorDto), this.addPoor);
    this.router.post(`${this.path}/:id`, this.updatePoor);
    this.router.delete(`${this.path}/:id`, this.delPoor);
  }

  private getPoors = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // tslint:disable-next-line: radix
    const page = parseInt(req.query.page) || 1;
    delete req.query.page;
    const search: any = req.query;
    if ( req.user.town ) {
      search.town =  req.user.town || search.town;
    }
    if (req.query.name) {
      const nameReg = new RegExp(req.query.name, 'i');
      search.name = nameReg;
    }
    if (req.query.userCode) {
      const cardReg = new RegExp(req.query.userCode, 'i');
      search.userCode = cardReg;
    }
    this.poor.find(search).count().then(count => {
      this.poor.find(search).skip((page - 1) * 10).limit(10).populate('town').populate('village').then(poors => {
        res.send({
          poors,
          page,
          count
        });
      }).catch(next);
    }).catch(next);
  }

  private getCellers = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const cellCode = req.query.cellCode;
    const id = req.query.current;
    this.poor.find({'_id': {$ne: id}, 'cell.cellCode': cellCode }).then(poors => {
      res.send(poors);
    }).catch(next);
  }

  private searchPoors = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const search = req.query.search;
    const reg = new RegExp(search, 'i');
    let query;
    if ( req.user.town ) {
      query =  { town:  req.user.town};
    }
    this.poor.find(query).or([{ name: {$regex: reg}}, { phone: {$regex: reg}}, { userCode: {$regex: reg}}])
    .populate('town').populate('village').then(poors => {
      res.send(poors);
    }).catch(next);
  }

  private getPoorById = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id;
    this.poor.findById(id).populate('town').populate('village').then(poor => {
      res.send(poor);
    }).catch(next);
  }

  private addPoor = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const poorData = req.body;
    const createPoor = new this.poor(poorData);
    createPoor.save().then(poor => {
      res.send(poor);
    }).catch(e => {
      if (e.code === 11000) {
        e.message = `${poorData.name} 该用户已存在`;
      }
      return next(e);
    });
  }

  private updatePoor = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id;
    const poor = req.body;
    this.poor.findByIdAndUpdate(id, poor).then(poor => {
      res.send(poor);
    }).catch(next);
  }

  private delPoor = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id;
    this.poor.findByIdAndDelete(id).then(success => {
      if (success) {
        res.send(200);
      } else {
        res.send(400);
      }
    }).catch(next);
  }
}

export default PoorController;
