import Controller from '../interfaces/controller.interfaces'
import * as express from 'express'
import poorModel from './poor.model'
import { townModel } from '../town'
import { ObjectId } from 'mongodb'
import validateMiddleware from '../middleware/validation.middleware'
import CreatePoorDto from './poor.dto'
import { conf } from './excel.conf'
import * as nodeExcel from 'excel-export'

class PoorController implements Controller {
  public path = '/poor'
  public router = express.Router()
  public excelConf = conf
  private poor = poorModel
  private town = townModel

  constructor() {
    this.initializeRouters()
  }

  private initializeRouters() {
    this.router.get(this.path, this.getPoors)
    this.router.get(`${this.path}/search`, this.searchPoors)
    this.router.get(`${this.path}/export`, this.exportPoors)
    this.router.get(`${this.path}/:id`, this.getPoorById)
    this.router.post(`${this.path}`, this.addOrUpdatePoor)
    this.router.post(`${this.path}/:id`, this.updatePoor)
    this.router.delete(`${this.path}/:id`, this.delPoor)
  }

  private getPoors = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if ( !req.user.town && req.user.roles.indexOf('ADMIN') === -1) {
      return next('用户没有从属的村镇, 无法完成此操作')
    }
    // tslint:disable-next-line: radix
    const page = parseInt(req.query.page) || 1
    delete req.query.page
    const search: any = {}
    if (req.user.roles.indexOf('ADMIN') === -1 ) {
      search.town =  req.user.town
    } else {
      if (req.query.town) {
        search.town = req.query.town
      }
      if (req.query.village) {
        search.village = req.query.village
      }
    }

    if (req.query.village) {
      search.village = new ObjectId(req.query.village)
    }

    if (req.query.name) {
      const nameReg = new RegExp(req.query.name, 'i')
      search.name = nameReg
    }
    if (req.query.houseCode) {
      const houseReg = new RegExp(req.query.houseCode, 'i')
      search.houseCode = houseReg
    }
    if (req.query.personCode) {
      const personCodeReg = new RegExp(req.query.personCode, 'i')
      search.personCode = personCodeReg
    }
    if (req.query.idcard) {
      const idcardReg = new RegExp(req.query.idcard, 'i')
      search.idcard = idcardReg
    }
    if (Array.isArray(req.query.updatedAt) && req.query.updatedAt.length === 2) {
      search.updatedAt = {
        $gte: new Date(req.query.updatedAt[0]),
        $lte: new Date(req.query.updatedAt[1]),
      }
    }
    this.poor.find(search).count().then(count => {
      this.poor.find(search).skip((page - 1) * 10).limit(10).populate('town').populate('village').then(poors => {
        res.send({
          poors,
          page,
          count,
        })
      }).catch(next)
    }).catch(next)
  }

  private exportPoors = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if ( !req.user.town && req.user.roles.indexOf('ADMIN') === -1) {
      return next('用户没有从属的村镇, 无法完成此操作')
    }
    // tslint:disable-next-line: radix
    delete req.query.page
    const search: any = {}
    if (req.user.roles.indexOf('ADMIN') === -1 ) {
      search.town =  req.user.town
    } else {
      if (req.query.town) {
        search.town = req.query.town
      }
      if (req.query.village) {
        search.village = req.query.village
      }
    }

    if (req.query.village) {
      search.village = new ObjectId(req.query.village)
    }

    if (req.query.name) {
      const nameReg = new RegExp(req.query.name, 'i')
      search.name = nameReg
    }
    if (req.query.houseCode) {
      const houseReg = new RegExp(req.query.houseCode, 'i')
      search.houseCode = houseReg
    }
    if (req.query.personCode) {
      const personCodeReg = new RegExp(req.query.personCode, 'i')
      search.personCode = personCodeReg
    }
    if (req.query.idcard) {
      const idcardReg = new RegExp(req.query.idcard, 'i')
      search.idcard = idcardReg
    }
    if (Array.isArray(req.query.updatedAt) && req.query.updatedAt.length === 2) {
      search.updatedAt = {
        $gte: new Date(req.query.updatedAt[0]),
        $lte: new Date(req.query.updatedAt[1]),
      }
    }
      this.poor.find(search).populate('town').populate('village').then(poors => {
        this.excelConf.rows = []
        poors.forEach(v => {
          if (v.getJobStatus) {
            this.excelConf.rows.push([v.town.name, v.village.name, v.houseCode, v.personCode,
              v.name, v.idcard, v.houseHead, v.houseRelation, '是', v.jobDetail, v.jobAddr,
            v.jobCompanyName, v.jobType, v.jobIncome, '', '', '', '', '', '', '', '', v.helpPerson,
            v.helpPersonPosition, v.helpPersonPhone, v.updatedAt])
          } else {
            this.excelConf.rows.push([v.town.name, v.village.name, v.houseCode, v.personCode,
              v.name, v.idcard, v.houseHead, v.houseRelation, '否', '', '',
            '', '', '', v.noJobDetail, v.noJobSchool, v.noJobSchoolGrade,
            v.noWorkAbility, v.wantWork, v.wantWorkAddr, v.wantPioneer, v.createType, v.helpPerson,
            v.helpPersonPosition, v.helpPersonPhone, v.updatedAt])
          }
        })
        const result = nodeExcel.execute(this.excelConf)
        res.setHeader('Content-Type', 'application/vnd.openxmlformats')
        res.setHeader('Content-Disposition', 'attachment; filename=' + 'Export.xlsx')
        res.end(result, 'binary')
      }).catch(next)
  }

  private searchPoors = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const search = req.query.search
    const page = req.query.page || 1
    const reg = new RegExp(search, 'i')
    let query
    if ( req.user.town ) {
      query =  { town:  req.user.town}
    }
    const count = await this.poor
      .find(query).or(
        [{ name: {$regex: reg}}, { houseCode: {$regex: reg}}, { personCode: {$regex: reg}}, {idcard: {$regex: reg}}]
        ).count()
    this.poor.find(query).or(
      [{ name: {$regex: reg}}, { houseCode: {$regex: reg}}, { personCode: {$regex: reg}}, {idcard: {$regex: reg}}]
    )
    .skip((page - 1) * 10).limit(10).populate('town').populate('village').then(poors => {
      res.send({
        poors,
        page,
        count,
      })
    }).catch(next)
  }

  private getPoorById = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id
    this.poor.findById(id).populate('town').populate('village').then(poor => {
      res.send(poor)
    }).catch(next)
  }

  private addOrUpdatePoor = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const poorData = req.body
    if ( !req.user.town ) {
      return next('用户没有从属的村镇, 无法完成此操作')
    }
    poorData.town = req.user.town
    if (poorData._id) {
      delete poorData.updatedAt
      this.poor.findByIdAndUpdate(poorData._id, poorData).then(poor => {
        res.send(poor)
      })
    } else {
      const createPoor = new this.poor(poorData)
      createPoor.save().then(poor => {
        res.send(poor)
      }).catch(e => {
        if (e.code === 11000) {
          e.message = `${poorData.name} 该用户已存在`
        }
        return next(e)
      })
    }
  }

  private updatePoor = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id
    const poor = req.body
    this.poor.findByIdAndUpdate(id, poor).then(poor => {
      res.send(poor)
    }).catch(next)
  }

  private delPoor = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id
    this.poor.findByIdAndDelete(id).then(success => {
      if (success) {
        res.send(200)
      } else {
        res.send(400)
      }
    }).catch(next)
  }
}

export default PoorController
