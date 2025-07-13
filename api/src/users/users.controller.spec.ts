import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserRole } from '@/entities';
import { Response } from 'express';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<Partial<UsersService>>;

  beforeEach(async () => {
    // Create mock for UsersService
    const mockUsersService = {
      findAll: jest.fn(),
      findBy: jest.fn(),
      updateRole: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllUsers', () => {
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

      usersService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.getAllUsers();
      expect(result).toEqual(mockUsers);
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  describe('updateUserRole', () => {
    let mockResponse: Partial<Response>;

    beforeEach(() => {
      // Create a mock response object
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
    });

    it('should allow admin to update another user role', async () => {
      // Mock admin user
      const adminUser = {
        id: '1',
        email: 'admin@example.com',
        role: UserRole.Admin,
      } as User;

      // Mock target user
      const targetUser = {
        id: '2',
        email: 'user@example.com',
        role: UserRole.User,
      } as User;

      // Mock updated user
      const updatedUser = {
        ...targetUser,
        role: UserRole.Admin,
      };

      // Mock request with an admin user
      const mockRequest = { user: adminUser };

      // Mock service responses
      usersService.findBy.mockResolvedValue(targetUser);
      usersService.updateRole.mockResolvedValue(updatedUser);

      await controller.updateUserRole(
        mockRequest,
        mockResponse as Response,
        '2',
        { role: UserRole.Admin },
      );

      expect(usersService.findBy).toHaveBeenCalledWith('id', '2');
      expect(usersService.updateRole).toHaveBeenCalledWith('2', UserRole.Admin);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedUser);
    });

    it('should return 403 when non-admin tries to update role', async () => {
      // Mock regular user
      const regularUser = {
        id: '1',
        email: 'user@example.com',
        role: UserRole.User,
      } as User;

      // Mock request with regular user
      const mockRequest = { user: regularUser };

      await controller.updateUserRole(
        mockRequest,
        mockResponse as Response,
        '2',
        { role: UserRole.Admin },
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Forbidden: Only admins can update user roles',
      });
      expect(usersService.findBy).not.toHaveBeenCalled();
      expect(usersService.updateRole).not.toHaveBeenCalled();
    });

    it('should return 400 when admin tries to update their own role', async () => {
      // Mock admin user
      const adminUser = {
        id: '1',
        email: 'admin@example.com',
        role: UserRole.Admin,
      } as User;

      // Mock request with an admin user
      const mockRequest = { user: adminUser };

      await controller.updateUserRole(
        mockRequest,
        mockResponse as Response,
        '1', // Same ID as the admin user
        { role: UserRole.User },
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Cannot update your own role',
      });
      expect(usersService.findBy).not.toHaveBeenCalled();
      expect(usersService.updateRole).not.toHaveBeenCalled();
    });

    it('should return 400 when invalid role is provided', async () => {
      // Mock admin user
      const adminUser = {
        id: '1',
        email: 'admin@example.com',
        role: UserRole.Admin,
      } as User;

      // Mock request with admin user
      const mockRequest = { user: adminUser };

      // Create an invalid role
      const invalidRole = 'invalid_role' as UserRole;

      await controller.updateUserRole(
        mockRequest,
        mockResponse as Response,
        '2',
        { role: invalidRole },
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid role provided',
      });
      expect(usersService.findBy).not.toHaveBeenCalled();
      expect(usersService.updateRole).not.toHaveBeenCalled();
    });

    it('should return 404 when target user is not found', async () => {
      // Mock admin user
      const adminUser = {
        id: '1',
        email: 'admin@example.com',
        role: UserRole.Admin,
      } as User;

      // Mock request with an admin user
      const mockRequest = { user: adminUser };

      // Mock service to return null for findBy
      usersService.findBy.mockResolvedValue(null);

      await controller.updateUserRole(
        mockRequest,
        mockResponse as Response,
        '999', // Non-existent user ID
        { role: UserRole.Admin },
      );

      expect(usersService.findBy).toHaveBeenCalledWith('id', '999');
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User not found',
      });
      expect(usersService.updateRole).not.toHaveBeenCalled();
    });
  });
});
