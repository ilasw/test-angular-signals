export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}
