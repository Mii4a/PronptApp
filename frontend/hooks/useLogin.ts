import axios from "axios";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from 'react-query';

// ログイン用のAPI呼び出し関数
const loginRequest = async (email: string, password: string) => {
  const loginUrl = process.env.NEXT_PUBLIC_API_LOGIN_URL;
  if (!loginUrl) {
    throw new Error("LOGIN_URL is not defined");
  }

  const { data } = await axios.post(
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

  await axios.post(logoutUrl, {}, { withCredentials: true });
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

        // ユーザーIDがある場合、特定のページへリダイレクト
        if (data.id) {
          router.push('/products');
        }
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
