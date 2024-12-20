import axios from "axios";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { SessionUser } from '@/types/sessionUser';

// User モデルと対応した TypeScript インターフェイス
// ログイン用のAPI呼び出し関数
const loginRequest = async (email: string, password: string): Promise<{ user: SessionUser }> => {
  const loginUrl = process.env.NEXT_PUBLIC_API_LOGIN_URL;
  if (!loginUrl) {
    throw new Error("Request URL is not defined");
  }

  const { data } = await axios.post<{ user: SessionUser }>(
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
    throw new Error("Request URL is not defined");
  }

  await axios.delete(logoutUrl, { withCredentials: true });
};

// ログインユーザー取得用のAPI呼び出し関数
const fetchSessionUserRequest = async (): Promise<SessionUser> => {
  const getLoginUserUrl = process.env.NEXT_PUBLIC_API_GET_SESSION_USER_URL;
  if (!getLoginUserUrl) {
    throw new Error("Request URL is not defined");
  }

  const response = await axios.get<{ user: SessionUser }>(getLoginUserUrl, { withCredentials: true });
  const { user } = response.data;
  console.log('fetch User:', user);
  return user;
}

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // useMutationでログイン処理を管理
  const mutation = useMutation(
    ({ email, password }: { email: string; password: string }) => loginRequest(email, password),
    {
      onSuccess: (data) => {
        // ログイン成功時にユーザー情報をReact Queryに保存
        const { user } = data;
        queryClient.setQueryData(['sessionUser'], user);
        console.log("user query data:", user);

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
      queryClient.removeQueries(['sessionUser']);
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

export const useFetchSessionUser = (options = {}) => {
  return useQuery(['sessionUser'], fetchSessionUserRequest, {
    ...options,
    retry: false,
    onError: (error) => {
      console.error('Failed to fetch session:', error);
    }
  });
}
