import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const GoogleCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { code } = router.query;

        if (code) {
          // サーバーにOAuthコードを送信
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback`,
            { code },
            { withCredentials: true }
          );

          // ログイン成功後のリダイレクト
          router.push('/products');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        router.push('/login');
      }
    };

    if (router.isReady) {
      handleCallback();
    }
  }, [router]);

  return <div>Loading...</div>;
};

export default GoogleCallback;
