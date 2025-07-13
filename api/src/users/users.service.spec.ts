import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User, UserRole } from '@/entities';

const mockUserRepository = () => ({
  findOne: jest.fn(),
  findOneOrFail: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findBy', () => {
    it('should find a user by a property', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.User,
      } as User;

      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findBy('email', 'test@example.com');
      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return undefined if user is not found', async () => {
      userRepository.findOne.mockResolvedValue(undefined);

      const result = await service.findBy('email', 'nonexistent@example.com');
      expect(result).toBeUndefined();
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
        password: 'password',
      };

      const mockUser = {
        id: '2',
        ...userData,
        role: UserRole.User,
      } as User;

      userRepository.create.mockReturnValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(userData);
      expect(result).toEqual(mockUser);
      expect(userRepository.create).toHaveBeenCalledWith(userData);
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        {
          id: '1',
          email: 'test1@example.com',
          firstName: 'Test1',
          lastName: 'User1',
          role: UserRole.User,
        },
        {
          id: '2',
          email: 'test2@example.com',
          firstName: 'Test2',
          lastName: 'User2',
          role: UserRole.Admin,
        },
      ] as User[];

      userRepository.find.mockResolvedValue(mockUsers);

      const result = await service.findAll();
      expect(result).toEqual(mockUsers);
      expect(userRepository.find).toHaveBeenCalledWith({
        select: ['id', 'email', 'firstName', 'lastName', 'role'],
      });
    });
  });

  describe('updateRole', () => {
    it('should update a user role', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.User,
      } as User;

      const updatedUser = {
        ...mockUser,
        role: UserRole.Admin,
      };

      userRepository.findOneOrFail.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateRole('1', UserRole.Admin);
      expect(result).toEqual(updatedUser);
      expect(userRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(userRepository.save).toHaveBeenCalledWith({
        ...mockUser,
        role: UserRole.Admin,
      });
    });

    it('should throw an error if user is not found', async () => {
      userRepository.findOneOrFail.mockRejectedValue(
        new Error('User not found'),
      );

      await expect(
        service.updateRole('nonexistent', UserRole.Admin),
      ).rejects.toThrow('User not found');
      expect(userRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: 'nonexistent' },
      });
    });
  });
});
