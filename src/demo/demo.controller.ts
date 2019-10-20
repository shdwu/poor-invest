import Controller from '../interfaces/controller.interfaces';
import * as express from 'express';
import demoModel from './demo.model';
import validateMiddleware from '../middleware/validation.middleware';

class DemoController implements Controller {
  public path = '/demo';
  public router = express.Router();
  private allDemo = demoModel.allModel;
  private partDemo = demoModel.partModel;

  constructor() {
    this.initializeRouters();
  }

  private initializeRouters() {
    this.router.get(`${this.path}/getAll`, this.getAll);
    this.router.get(`${this.path}/getPart`, this.getPart);
  }

  private getAll = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // tslint:disable-next-line: radix
    const page = parseInt(req.query.page) || 1;
    delete req.query.page;
    const search: any = req.query;
    this.allDemo.find(search).count().then(count => {
      this.allDemo.find(search).skip((page - 1) * 10).limit(10).then(demos => {
        res.send({
          demos,
          page,
          count
        });
      }).catch(next);
    }).catch(next);
  }

  private getPart = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const page = req.query.page || 1;
    delete req.query.page;
    const search: any = req.query;
    this.partDemo.find(search).count().then(count => {
      this.partDemo.find(search).skip((page - 1) * 10).limit(10).then(demos => {
        res.send({
          demos,
          page,
          count
        });
      }).catch(next);
    }).catch(next);
  }
}

export default DemoController;
