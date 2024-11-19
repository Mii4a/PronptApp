import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const GoogleCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const { code } = router.query;

      if (!code) {
        console.log('OAuth code is missing.');
        return;
      }

      console.log("code:", code)

      try {
        console.log("code:", code)
        // サーバーにOAuthコードを送信
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google/callback`,
          { code },
          { withCredentials: true }
        );

        console.log('OAuth callback success:', response.data);

        // ログイン成功後のリダイレクト
        router.push('/products');
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('OAuth callback Axios error:', error.response?.data || error.message);
        } else {
          console.error('OAuth callback general error:', error);
        }

        // エラーが発生した場合、ログインページへ
        router.push('/login');
      }
    };

    if (router.isReady) {
      handleCallback();
    }
  }, [router.isReady, router.query]);

  return <div>Loading...</div>;
};

export default GoogleCallback;
