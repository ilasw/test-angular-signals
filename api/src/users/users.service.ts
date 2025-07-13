import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '@/entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findBy<K extends keyof User>(
    propertyName: K,
    value: User[K],
  ): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { [propertyName]: value } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'email', 'firstName', 'lastName', 'role'],
    });
  }

  async updateRole(id: string, role: UserRole): Promise<User> {
    const user = await this.userRepository.findOneOrFail({ where: { id } });
    user.role = role;
    return this.userRepository.save(user);
  }
}
