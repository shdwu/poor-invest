import { Village } from '../village'
import { Town } from '../town'

interface User {
  _id: string
  // 用户名，用于系统登录
  username: string
  // 密码，用于系统登录
  password: string
  // 是否属于就业局
  roles: string[]
  // 乡（镇）
  town: Town
  comparePassword: comparePasswordFunction
}

export type comparePasswordFunction = (candidatePassword: string) => boolean

export { User }
