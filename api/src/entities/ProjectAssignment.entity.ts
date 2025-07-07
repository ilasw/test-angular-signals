import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User.entity';
import { Project } from './Project.entity';

export enum ProjectRole {
  ProjectManager = 'project_manager',
  Developer = 'developer',
  Tester = 'tester',
  Designer = 'designer',
  Analyst = 'analyst',
}

@Entity('project_assignments')
export class ProjectAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  projectId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  assignedAt: Date;

  @Column({ type: 'uuid' })
  assignedById: string;

  @Column({
    type: 'enum',
    enum: ProjectRole,
    default: ProjectRole.Developer,
  })
  role: ProjectRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.projectAssignments)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Project, (project) => project.projectAssignments)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @ManyToOne(() => User, (user) => user.assignedProjects)
  @JoinColumn({ name: 'assignedById' })
  assignedBy: User;
}
