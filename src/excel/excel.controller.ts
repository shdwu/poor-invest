import * as express from 'express';
import xlsx from 'node-xlsx';
import Controller from '../interfaces/controller.interfaces';
import poorModel from '../poor/poor.model';
import townModel from '../town/town.model';
import villageModel from '../village/village.model';
import Poor from '../poor/poor.interface';
import Town from '../town/town.interface';
import * as multer from 'multer';
import cache from '../utils/cache';

class ExcelController implements Controller {
  public path = '/excel';
  public router = express.Router();
  private poor = poorModel;
  private town = townModel;
  private village = villageModel;
  private upload: multer.Instance;

  constructor() {
    this.initializeUpload();
    this.initializeRouters();
  }

  private initializeRouters() {
    this.router.post(`${this.path}/parse`, this.upload.single('excel'), this.parseExcel);
    this.router.post(`${this.path}/enter`, this.enterExcel);
  }

  private initializeUpload() {
    const storage = multer.memoryStorage();
    this.upload = multer({ dest: 'uploads/', storage });
  }

  private enterExcel(req: express.Request, res: express.Response, next: express.NextFunction) {
    const poors: Poor[] = req.body;
    poors.forEach((v: any) => {
      new this.poor(v).save().then();
    });
    res.send(200);
  }

  private parseExcel(req: express.Request, res: express.Response, next: express.NextFunction) {
    const workSheets = xlsx.parse(req.file.buffer);
    const poors: Poor[] = [];
    if (workSheets && workSheets[0]) {
      workSheets[0].data.forEach((v: string[], i) => {
        // 前两行不要
        if (i > 1 && v[3]) {
          const town: Town = cache.townsCache[v[0].trim()];
          if (town) {
            this.village.findOne({town: town._id, name: v[1].trim()}).then(village => {
              const poor = new this.poor({
                town: town._id,
                village:  village || village._id ,
                team: v[2].trim(),
                name: v[3].trim(),
                cell: {
                  cellCode: v[4].trim(),
                  relationship: v[5].trim()
                },
                userCode: v[6].trim(),
                phone: parseInt(v[7], 10),
                jobState: v[8].trim(),
                state: v[9].trim(),
                isJob: v[10].trim(),
                jobType: v[11].trim(),
                workType: v[12].trim(),
                jobAdd: v[13].trim(),
                salary: v[14].trim(),
                train: v[15].trim(),
                trainItem: v[16].trim(),
                noJobSeason: v[17].trim(),
                helpPerson: {
                  // 姓名
                  name: v[18].trim(),
                  // 职务
                  position: v[19].trim(),
                  // 联系电话
                  phone: v[20].trim()
                }
              }).save().then(p => {
                poors.push(p);
              });
            });
          }
        }
      });
    }
    return res.json(poors);
  }

}

export default ExcelController;
