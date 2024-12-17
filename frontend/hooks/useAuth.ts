import axios from "axios";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from 'react-query';

// User モデルと対応した TypeScript インターフェイス
interface User {
  id: number;
  email: string;
  password?: string;
  name: string;
  role: 'USER' | 'ADMIN'; 
  refreshToken?: string;
  googleId?: string;
  createdAt: string; 
  updatedAt: string;
  bio?: string;
  avatar?: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  // products, transactions, userProductsも取得したければ型定義
  // products?: Product[];
  // transactions?: Transaction[];
  // userProducts?: UserProduct[];
}

// ログイン用のAPI呼び出し関数
const loginRequest = async (email: string, password: string): Promise<User> => {
  const loginUrl = process.env.NEXT_PUBLIC_API_LOGIN_URL;
  console.log("LOGIN URL:", loginUrl);
  if (!loginUrl) {
    throw new Error("LOGIN_URL is not defined");
  }

  const { data } = await axios.post<User>(
    loginUrl,
    { email, password },
    { withCredentials: true }
  );
  return data;
};

// ログアウト用のAPI呼び出し関数
const logoutRequest = async () => {
  const logoutUrl = process.env.NEXT_PUBLIC_API_LOGOUT_URL;
  if (!logoutUrl) {
    throw new Error("LOGOUT_URL is not defined");
  }

  await axios.delete(logoutUrl, { withCredentials: true });
};

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // useMutationでログイン処理を管理
  const mutation = useMutation(
    ({ email, password }: { email: string; password: string }) => loginRequest(email, password),
    {
      onSuccess: (data) => {
        // ログイン成功時にユーザー情報をReact Queryに保存
        queryClient.setQueryData(['user'], data);

        // 特定のページへリダイレクト
        router.push('/products');
      },
      onError: (error) => {
        console.error('Login failed:', error);
        alert('Email or Password is invalid');
      },
    }
  );

  const login = (email: string, password: string) => {
    mutation.mutate({ email, password });
  };

  return { login, isLoading: mutation.isLoading };
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // useMutationでログアウト処理を管理
  const mutation = useMutation(logoutRequest, {
    onSuccess: () => {
      // ログアウト時にユーザー情報をキャッシュからクリア
      queryClient.removeQueries(['user']);
      // ログインページへリダイレクト
      router.push('/login');
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      alert('Failed to logout. Please try again.');
    },
  });

  const logout = () => {
    mutation.mutate();
  };

  return { logout, isLoading: mutation.isLoading };
};
