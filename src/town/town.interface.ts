import { Village } from '../village'

interface Town {

  _id: string,

  name: string

  villages: Village[]
}

export { Town }
