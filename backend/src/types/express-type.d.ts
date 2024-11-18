import 'express-session';

declare module 'express-session' {
  // User 型の定義
  interface User {
    id: number;
    name: string;
    role?: string;
  }

  // SessionData に User 型を使用
  interface SessionData {
    user?: User;
  }
}
