import { IsString, IsArray } from 'class-validator'

class UserDto {

  @IsString()
  public name: string

}

export { UserDto }
