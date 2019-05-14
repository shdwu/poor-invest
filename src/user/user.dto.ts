import { IsString, IsBoolean } from 'class-validator';

class CreateUserDto {
  @IsString()
  public name: string;

  @IsString()
  public phone: string;

  @IsString()
  public username: string;

  @IsString()
  public password: string;

  @IsBoolean()
  public isBureau: boolean;
}

export default CreateUserDto;
