import 'express-session';

declare module 'express-session' {
  // User 型の定義
  interface SessionData {
      user?: {
      id: number;
      name: string;
      role?: string;
    };
  }
}
