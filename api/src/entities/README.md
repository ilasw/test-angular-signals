# Entity Documentation

This directory contains the TypeORM entities for the admin dashboard application.

## Entities Overview

### User

Represents a user in the system. Users can have one of two roles:

- **ADMIN**: Can manage users and assign projects
- **USER**: Regular users who can view users and their assigned projects

### Project

Represents a project in the system. Projects have properties like name, description, start/end dates, and status.

### ProjectAssignment

Represents the assignment of a user to a project. This is a join entity that also stores metadata about the assignment,
such as:

- Who assigned the user to the project
- When the assignment was made
- The role of the user in the project

## Entity Relationships

1. **User to ProjectAssignment**: One-to-Many (One user can be assigned to multiple projects)
2. **Project to ProjectAssignment**: One-to-Many (One project can have multiple users assigned)
3. **User to ProjectAssignment (as assignedBy)**: One-to-Many (One admin can make multiple project assignments)

## Usage

To use these entities in your NestJS modules:

```typescript
import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User, Project, ProjectAssignment} from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Project, ProjectAssignment]),
  ],
  // ...
})
export class YourModule {
}
```

Then you can inject the repositories in your services:

```typescript
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User, Project, ProjectAssignment} from '../entities';

@Injectable()
export class YourService {
  constructor(
      @InjectRepository(User)
      private userRepository: Repository<User>,
      @InjectRepository(Project)
      private projectRepository: Repository<Project>,
      @InjectRepository(ProjectAssignment)
      private projectAssignmentRepository: Repository<ProjectAssignment>,
  ) {
  }

  // Your service methods here
}
```

## Database Configuration

The database connection is configured in the `app.module.ts` file. Make sure to update the connection details according
to your environment.

## Why do we need the ProjectAssignment entity?

The ProjectAssignment entity serves as a join table between User and Project entities, but it's much more than a simple
many-to-many relationship. Here's why it's necessary:

1. **Rich Relationship Data**: Unlike a simple many-to-many relationship, ProjectAssignment stores additional metadata
   about the relationship, such as:
    - The role of the user in the project (ProjectManager, Developer, Tester, etc.)
    - When the assignment was made (assignedAt)
    - Who made the assignment (assignedBy - tracking which admin assigned the user)

2. **Audit Trail**: The entity provides an audit trail of project assignments, allowing you to track who assigned a user
   to a project and when.

3. **Role-Based Project Access**: Users can have different roles in different projects. For example, a user might be a
   Developer in one project and a Tester in another.

4. **Historical Record**: Even if a user or project is deleted, you might want to keep a record of past assignments for
   reporting or auditing purposes.

5. **Flexibility for Future Extensions**: If you need to add more metadata about the assignment in the future (like
   assignment notes, permissions, etc.), you can easily add fields to the ProjectAssignment entity.

## How to use the ProjectAssignment entity

Here are some practical examples of how to use the ProjectAssignment entity:

### Assigning a user to a project

```typescript

@Injectable()
export class ProjectAssignmentService {
  constructor(
      @InjectRepository(ProjectAssignment)
      private projectAssignmentRepository: Repository<ProjectAssignment>,
      @InjectRepository(User)
      private userRepository: Repository<User>,
  ) {
  }

  async assignUserToProject(
      userId: string,
      projectId: string,
      role: ProjectRole,
      adminId: string,
  ): Promise<ProjectAssignment> {
    // Verify that the admin user has admin privileges
    const admin = await this.userRepository.findOne({where: {id: adminId}});
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only admins can assign users to projects');
    }

    // Create a new project assignment
    const assignment = this.projectAssignmentRepository.create({
      userId,
      projectId,
      role,
      assignedById: adminId,
      assignedAt: new Date(),
    });

    return this.projectAssignmentRepository.save(assignment);
  }
}
```

### Getting all users assigned to a project with their roles

```typescript
async
getUsersForProject(projectId
:
string
):
Promise < any[] > {
  const assignments = await this.projectAssignmentRepository.find({
    where: {projectId},
    relations: ['user'],
  });

  return assignments.map(assignment => ({
    user: {
      id: assignment.user.id,
      email: assignment.user.email,
      firstName: assignment.user.firstName,
      lastName: assignment.user.lastName,
    },
    role: assignment.role,
    assignedAt: assignment.assignedAt,
  }));
}
```

### Getting all projects assigned to a user

```typescript
async
getProjectsForUser(userId
:
string
):
Promise < any[] > {
  const assignments = await this.projectAssignmentRepository.find({
    where: {userId},
    relations: ['project', 'assignedBy'],
  });

  return assignments.map(assignment => ({
    project: {
      id: assignment.project.id,
      name: assignment.project.name,
      description: assignment.project.description,
      status: assignment.project.status,
    },
    role: assignment.role,
    assignedAt: assignment.assignedAt,
    assignedBy: {
      id: assignment.assignedBy.id,
      email: assignment.assignedBy.email,
      firstName: assignment.assignedBy.firstName,
      lastName: assignment.assignedBy.lastName,
    },
  }));
}
```

### Changing a user's role in a project

```typescript
async
updateUserRoleInProject(
    userId
:
string,
    projectId
:
string,
    newRole
:
ProjectRole,
    adminId
:
string,
):
Promise < ProjectAssignment > {
  // Verify admin privileges
  const admin = await this.userRepository.findOne({where: {id: adminId}});
  if(!
admin || admin.role !== UserRole.ADMIN
)
{
  throw new UnauthorizedException('Only admins can update project roles');
}

// Find the existing assignment
const assignment = await this.projectAssignmentRepository.findOne({
  where: {userId, projectId},
});

if (!assignment) {
  throw new NotFoundException('Project assignment not found');
}

// Update the role and who made the change
assignment.role = newRole;
assignment.assignedById = adminId;
assignment.assignedAt = new Date(); // Update the assignment date

return this.projectAssignmentRepository.save(assignment);
}
```

These examples demonstrate how the ProjectAssignment entity enables complex operations that wouldn't be possible with a
simple many-to-many relationship.
