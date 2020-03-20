import { IsString, IsBoolean } from 'class-validator'

class UserDto {

  @IsString()
  public username: string

  @IsString()
  public password: string

  @IsBoolean()
  public admin: boolean
}

export { UserDto }
