import Village from '../village/village.interface'

interface User {
  _id: string
  // 用户名，用于系统登录
  username: string
  // 密码，用于系统登录
  password: string
  // 是否属于就业局
  admin: boolean
  village: Village
  comparePassword: comparePasswordFunction
}

export type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => void) => boolean

export { User }
