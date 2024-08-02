import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    default: 'comment comment',
  })
  comment: string;

  @ApiProperty({
    default: 31,
  })
  userId: number;

  @ApiProperty({
    default: 14,
  })
  postId: number;
}
