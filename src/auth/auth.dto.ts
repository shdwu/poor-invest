import { IsString } from 'class-validator'

class PostLoginDto {
  @IsString()
  public username: string

  @IsString()
  public password: string

  @IsString()
  public code: string
}

export default PostLoginDto
