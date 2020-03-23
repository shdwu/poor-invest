import { IsString, IsArray } from 'class-validator'
import { UserRole } from './roles.enum'

class UserDto {

  @IsString()
  public username: string

  @IsString()
  public password: string

  public village: string

  @IsArray()
  public roles: UserRole[]
}

export { UserDto }
