import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
@ApiTags('comments')
@ApiBearerAuth()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':id')
  findAllPostComments(@Param('id') postId: string) {
    return this.commentsService.findAllPostComments(+postId);
  }

  @Get(':count/latest')
  findLatestComments(@Param('count') count: string) {
    return this.commentsService.findLatestComments(+count);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCommentDto: CreateCommentDto, @UserId() userId: number) {
    return this.commentsService.create(createCommentDto, userId);
  }
}
