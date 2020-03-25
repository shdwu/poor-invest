import { IsString } from 'class-validator'

class VillageDto {

  @IsString()
  public name: string

  public town: string
}

export { VillageDto }
