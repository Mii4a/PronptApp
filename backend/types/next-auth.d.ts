import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string; // ユーザーID
    email: string;
    name?: string;
    role?: string;
    // パスワードはセッションに含めない
  }

  interface Session {
    user: User;
  }
}