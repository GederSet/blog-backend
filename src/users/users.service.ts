import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  create(dto: CreateUserDto) {
    return this.userRepository.save(dto);
  }

  async findByLogin(login: string) {
    return this.userRepository.findOneBy({ login });
  }

  async findById(id: number) {
    return this.userRepository.findOneBy({ id });
  }
}
