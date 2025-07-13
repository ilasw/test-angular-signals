import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '@/users/users.service';
import { User, UserRole } from '@/entities';
import * as cryptModule from '@/shared/crypt';

jest.mock('@/shared/crypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<Partial<UsersService>>;
  let jwtService: jest.Mocked<Partial<JwtService>>;

  beforeEach(async () => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    const mockUsersService = {
      findBy: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object without password when validation is successful', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.User,
      } as User;

      const { password, ...userWithoutPassword } = mockUser;

      usersService.findBy.mockResolvedValue(mockUser);
      (cryptModule.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toEqual(userWithoutPassword);
      expect(usersService.findBy).toHaveBeenCalledWith(
        'email',
        'test@example.com',
      );
      expect(cryptModule.compare).toHaveBeenCalledWith(
        'password',
        'hashedPassword',
      );
    });

    it('should return null when user is not found', async () => {
      usersService.findBy.mockResolvedValue(undefined);

      const result = await service.validateUser(
        'nonexistent@example.com',
        'password',
      );
      expect(result).toBeNull();
      expect(usersService.findBy).toHaveBeenCalledWith(
        'email',
        'nonexistent@example.com',
      );
      expect(cryptModule.compare).not.toHaveBeenCalled();
    });

    it('should return null when password does not match', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.User,
      } as User;

      usersService.findBy.mockResolvedValue(mockUser);
      (cryptModule.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(
        'test@example.com',
        'wrongPassword',
      );
      expect(result).toBeNull();
      expect(usersService.findBy).toHaveBeenCalledWith(
        'email',
        'test@example.com',
      );
      expect(cryptModule.compare).toHaveBeenCalledWith(
        'wrongPassword',
        'hashedPassword',
      );
    });
  });

  describe('login', () => {
    it('should return access token and user object', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.User,
      } as Partial<User>;

      const mockToken = 'jwt-token';
      jwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(mockUser);
      expect(result).toEqual({
        access_token: mockToken,
        user: mockUser,
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
        role: mockUser.role,
      });
    });
  });
});
