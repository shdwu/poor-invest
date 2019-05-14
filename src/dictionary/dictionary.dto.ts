import { IsString, IsBoolean } from 'class-validator';

class AddDictDto {
  @IsString()
  public key: string;

  @IsString()
  public value: string;
}

export default AddDictDto;
