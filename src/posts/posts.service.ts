import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}

  async findAll() {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user', 'post.userId = user.id')
      .loadRelationCountAndMap('post.commentsCount', 'post.comments')
      .orderBy('post.createdAt', 'DESC')
      .getMany();

    return posts.map((post) => {
      const { comments, ...rest } = post;
      return {
        ...rest,
        commentsCount: post.commentsCount,
      };
    });
  }

  async findOne(id: number) {
    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user', 'post.userId = user.id')
      .loadRelationCountAndMap('post.commentsCount', 'post.comments')
      .where('post.id = :id', { id })
      .getOne();

    if (!post) {
      return null;
    }

    const { comments, ...rest } = post;
    return {
      ...rest,
      commentsCount: post.commentsCount,
    };
  }

  create(createPostDto: CreatePostDto, userId) {
    return this.postRepository.save({
      title: createPostDto.title,
      text: createPostDto.text,
      fileName: createPostDto.fileName,
      originalFile: createPostDto.originalFile,
      user: { id: userId },
      tags: createPostDto.tags
        .replace(/#/g, '')
        .split(',')
        .map((tag) => tag.trim()),
    });
  }

  async update(id: number, userId: number, updatePostDto: UpdatePostDto) {
    const result = await this.postRepository
      .createQueryBuilder()
      .update(PostEntity)
      .set({
        title: updatePostDto.title,
        text: updatePostDto.text,
        fileName: updatePostDto.fileName,
        originalFile: updatePostDto.originalFile,
        tags: updatePostDto.tags
          .replace(/#/g, '')
          .split(',')
          .map((tag) => tag.trim()),
      })
      .where('id = :id AND userId = :userId', { id, userId })
      .returning('*')
      .execute();

    if (result.affected === 0) {
      throw new Error('Вы не можете редактировать чужую запись');
    }

    return result.raw[0];
  }

  async remove(id: number, userId) {
    const result = await this.postRepository
      .createQueryBuilder()
      .delete()
      .from(PostEntity)
      .where('id = :id AND userId = :userId', { id, userId })
      .execute();

    if (result.affected === 0) {
      throw new Error('Вы не можете удалить чужую запись');
    }

    return 'Пост был удален';
  }

  async updateViews(id: number) {
    const result = await this.postRepository
      .createQueryBuilder()
      .update(PostEntity)
      .set({ viewsCount: () => 'viewsCount + 1' })
      .where('id = :id', { id })
      .execute();

    if (result.affected === 0) {
      throw new Error('Ошибка при увеличении просмотров');
    }

    return 'Количество просмотров было увеличено на 1';
  }

  async getTags(limit: number = 5) {
    const posts = await this.postRepository.find({
      take: limit,
    });

    const tags = posts
      .map((post) => post.tags)
      .flat()
      .slice(0, limit);

    return tags;
  }
}
