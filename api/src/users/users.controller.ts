import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { User, UserRole } from '@/entities';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  getAllUsers() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Put('role/:id')
  async updateUserRole(
    @Req() req,
    @Res() res: Response,
    @Param('id') id: string,
    @Body() { role }: { role: UserRole },
  ) {
    const user: User = req.user;
    if (!user || user.role !== UserRole.Admin) {
      return res
        .status(403)
        .json({ message: 'Forbidden: Only admins can update user roles' });
    }

    if (user.id === id) {
      return res.status(400).json({ message: 'Cannot update your own role' });
    }

    if (!Object.values(UserRole).includes(role)) {
      return res.status(400).json({ message: 'Invalid role provided' });
    }

    const targetUser = await this.usersService.findBy('id', id);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await this.usersService.updateRole(id, role);

    return res.json(updatedUser);
  }
}
