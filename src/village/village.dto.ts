import { IsString } from 'class-validator'

class VillageDto {

  @IsString()
  public name: string
}

export { VillageDto }
