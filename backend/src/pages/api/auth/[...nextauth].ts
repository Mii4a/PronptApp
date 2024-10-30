import NextAuth, { User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

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
        }

        // データベースからユーザーを取得するロジックをここに記述
        const userFromDb = await getUserFromDatabase(credentials.email, credentials.password);

        if (userFromDb) {
          const user: User = {
            id: userFromDb.id.toString(),
            email: userFromDb.email,
            name: userFromDb.name,
            role: userFromDb.role,
          };
          return user;
        } else {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      session.user.role = user.role;
      return session;
    },
  },
});

// データベースからユーザーを取得する関数の例
async function getUserFromDatabase(email: string, password: string) {
  // ここでデータベースクエリを実行し、ユーザーを取得
  return {
    id: 1,
    email: 'jsmith@example.com',
    name: 'J Smith',
    role: 'user',
  };
}