import 'express';

declare module 'express-serve-static-core' {
  // User 型の定義
  export interface Request {
    user?: {
      id: number;
      name: string;
      password?: string;
      email: string;
      bio: string | null;
      avatar: string | null; 
      emailNotifications: boolean;
      pushNotifications: boolean;
    };
  }
}
