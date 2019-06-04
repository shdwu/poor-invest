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
    this.router.post(`${this.path}/parse`, this.upload.single('file'), this.parseExcel);
    this.router.post(`${this.path}/enter`, this.enterExcel);
  }

  private initializeUpload() {
    const storage = multer.memoryStorage();
    this.upload = multer({ dest: 'uploads/', storage });
  }

  private enterExcel = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const poors: Poor[] = req.body;
    poors.forEach((v: any) => {
      new this.poor(v).save().then();
    });
    res.send(200);
  }

  private parseExcel = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const workSheets = xlsx.parse(req.file.buffer);
    const retInfos: Array<{ poor: Poor, errors: string[] }> = [];
    if (workSheets && workSheets[0]) {
      workSheets[0].data.forEach((v: string[], i) => {
        // 前两行不要
        if (i > 1 && v[3]) {
          const retInfo: { poor: Poor, errors: string[] } = {poor: {}, errors: []} as any;
          const poorData: any = {
                  team: v[2],
                  name: v[3],
                  cell: {
                    cellCode: v[4],
                    relationship: v[5]
                  },
                  userCode: v[6],
                  phone: '' + parseInt(v[7], 10),
                  jobState: v[8],
                  state: v[9],
                  isJob: v[10],
                  jobType: v[11],
                  workType: v[12],
                  jobAdd: v[13],
                  salary: v[14],
                  train: v[15],
                  trainItem: v[16],
                  noJobSeason: v[17],
                  helpPerson: {
                    // 姓名
                    name: v[18],
                    // 职务
                    position: v[19],
                    // 联系电话
                    phone: v[20]
                  }
                };
          const town: Town = cache.getTown()[v[0]];
          // 如果没有城镇，记录错误信息
          if (town) {
            poorData.town = town;
            town.villages.forEach( village => {
              if (village.name === (v[1] as string)) {
                poorData.village = village;
              }
            });
            // 如果没有村庄，记录错误信息
            if (!poorData.village) {
              retInfo.errors.push(`${v[1]} 该村庄不存在，请先创建村庄`);
            }
          } else {
            retInfo.errors.push(`${v[0]} 该城镇不存在，请先创建城镇`);
          }
          retInfo.poor = new this.poor(poorData);
          retInfos.push(retInfo);
        }
      });
    }
    return res.json(retInfos);
  }

}

export default ExcelController;
