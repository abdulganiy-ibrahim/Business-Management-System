export interface User {
  id: string;
  email: string;
  displayName: string;
  phone?: string;
  createdAt: Date;
  lastSignIn: Date;
}