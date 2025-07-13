import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserRole } from '@/entities';
import { UsersService } from '@/users/users.service';
import { crypt } from '@/shared/crypt';

@Injectable()
export class DatabaseSeederService implements OnModuleInit {
  constructor(private usersService: UsersService) {}

  async onModuleInit() {
    await this.seedAdminUser();
  }

  private async seedAdminUser() {
    const existingAdmin = await this.usersService.findBy(
      'email',
      'admin@example.com',
    );

    if (existingAdmin) {
      console.log('Admin user already exists, skipping seed');
      return;
    }

    const hashedPassword = await crypt('admin123');
    await this.usersService.create({
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.Admin,
    });
    console.log('Admin user seeded successfully');

    // add 2 more standard users
    await this.usersService.create({
      email: 'user1@example.com',
      password: hashedPassword,
      firstName: 'User',
      lastName: 'First',
      role: UserRole.User,
    });
    await this.usersService.create({
      email: 'user2@example.com',
      password: hashedPassword,
      firstName: 'User',
      lastName: 'Second',
      role: UserRole.User,
    });
  }
}
