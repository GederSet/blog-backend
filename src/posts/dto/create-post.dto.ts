import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    default: 'test title',
  })
  title: string;

  @ApiProperty({
    default: 'test string',
  })
  text: string;

  @ApiProperty({
    default: 'test tags',
  })
  tags: string;

  @ApiProperty({
    default: 'test imageUrl',
  })
  fileName: string;

  @ApiProperty({
    default: 'test originalUrl',
  })
  originalFile: string;
}
