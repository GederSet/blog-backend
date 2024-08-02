import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
  ) {}

  create(createCommentDto: CreateCommentDto, userId: number) {
    return this.commentRepository.save({
      comment: createCommentDto.comment,
      user: { id: userId },
      post: { id: createCommentDto.postId },
    });
  }

  findAllPostComments(postId: number) {
    return this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user', 'comment.userId = user.id')
      .leftJoinAndSelect('comment.post', 'post', 'comment.postId = post.id')
      .where('comment.postId = :postId', { postId })
      .orderBy('comment.createdAt', 'DESC')
      .getMany();
  }

  findLatestComments(count: number) {
    return this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user', 'comment.userId = user.id')
      .leftJoinAndSelect('comment.post', 'post', 'comment.postId = post.id')
      .orderBy('comment.createdAt', 'DESC')
      .take(count)
      .getMany();
  }
}
