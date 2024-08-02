import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    default: 'testlogin',
  })
  login: string;

  @ApiProperty({
    default: 'testtest',
  })
  password: string;
}
