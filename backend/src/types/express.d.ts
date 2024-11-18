import 'express';

declare module 'express' {
  // User 型の定義
  export interface Request {
    user?: {
      id: number;
      name: string;
      role?: string;
    };
  }
}
