import * as express from 'express';
import Controller from '../interfaces/controller.interfaces';
import Dictionary from './dictionary.interface';
import dictionaryModel from './dictionary.model';
import HttpException from '../exceptions/HttpException';
import validationMiddleware from '../middleware/validation.middleware';
import AddDictDto from './dictionary.dto';

class DictionaryController implements Controller {
  public path = '/dict';
  public router = express.Router();
  private dict = dictionaryModel;

  constructor() {
    this.initializeRouters();
  }

  private initializeRouters() {
    this.router.get(`${this.path}/:name`, this.getDict);
    this.router.post(`${this.path}`, validationMiddleware(AddDictDto), this.addDict);
    this.router.post(`${this.path}/del`, this.delDict);
  }

  private getDict(req: express.Request, res: express.Response, next: express.NextFunction) {
    const key = req.params.key;
    this.dict.find({key}).then( values => {
      res.send(values);
    }).catch(next);
  }

  private addDict(req: express.Request, res: express.Response, next: express.NextFunction) {
    const dictData: Dictionary  = req.body;
    const createDict = new this.dict(dictData);
    createDict.save().then(dict => {
      res.send(dict);
    }).catch(err => {
      next(new HttpException(400, err));
    });
  }

  private delDict(req: express.Request, res: express.Response, next: express.NextFunction) {
    const dictData: Dictionary  = req.body;
    this.dict.findOneAndDelete(dictData).then( success => {
      if (success) {
        res.send(200);
      } else {
        res.send(404);
      }
    }).catch(err => {
      next(new HttpException(400, err));
    });
  }
}

export default DictionaryController;
