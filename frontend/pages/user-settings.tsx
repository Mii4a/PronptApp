import React from 'react';
import UserSettings from '@/components/UserSettings';
import { useQueryClient } from 'react-query';
import { useFetchSessionUser } from '@/hooks/useAuth';
import { SessionUser } from '@/types/sessionUser';

const UserSettingPage: React.FC = () => {
  const queryClient = useQueryClient();

  // キャッシュからデータを取得
  const cachedUser = queryClient.getQueryData<SessionUser>('sessionUser');

  // キャッシュになければサーバーからデータを取得
  const { data: fetchedUser, isLoading, isError } = useFetchSessionUser({
    enabled: !cachedUser, // キャッシュがあればリクエストしない
  });

  // データがキャッシュにない & ロード中の場合
  if (!cachedUser && isLoading) {
    return <div>Loading...</div>;
  }

  // エラーの場合
  if (isError) {
    return <div>Error loading user data.</div>;
  }

  // キャッシュデータまたは取得データを使用
  const sessionUser = cachedUser || fetchedUser;
  console.log(sessionUser)
   
  if (!sessionUser) {
    return <div>No user data available.</div>;
  }

  return (
    <div>
      <UserSettings user={sessionUser} />
    </div>
  );
};

export default UserSettingPage;
