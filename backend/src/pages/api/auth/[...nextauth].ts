import NextAuth, { User, AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import query from '@/src/lib/pgClient';

// ユーザーの型定義に role を追加
interface CustomUser extends User {
  id: string;
  role: string;
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        // credentialsがundefinedでないことを確認
        if (!credentials) {
          return null;
          console.log("credentials undefined")
        }

        // データベースからユーザーを取得
        const userFromDb = await getUserFromDatabase(credentials.email);

        if (!userFromDb) {
          return null; // ユーザーが見つからない場合
          console.log("userFromDb undefined")
        }

        // パスワードの照合
        const isValidPassword = await bcrypt.compare(credentials.password, userFromDb.passwordHash);
        if (!isValidPassword) {
          return null; // パスワードが一致しない場合
          console.log("isValidPassword false")
        }

        // 認証成功時に返すユーザーオブジェクト
        const user: CustomUser = {
          id: userFromDb.id.toString(),
          email: userFromDb.email,
          name: userFromDb.name,
          role: userFromDb.role,
        };

        return user;
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      // セッションにユーザー情報を追加
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      // トークンにユーザー情報を追加
      if (user) {
        token.id = user.id;
        token.role = (user as CustomUser).role;
      }
      return token;
    }
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET, // 認証シークレット
} as AuthOptions);

// データベースからユーザーを取得する関数
async function getUserFromDatabase(email: string) {
  const result = await query('SELECT id, email, name, role, password_hash FROM users WHERE email = $1', [email]);
  if (result.rows.length > 0) {
    return {
      id: result.rows[0].id,
      email: result.rows[0].email,
      name: result.rows[0].name,
      role: result.rows[0].role,
      passwordHash: result.rows[0].password_hash,
    };
  }
  return null;
}
