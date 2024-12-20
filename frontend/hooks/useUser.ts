import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { SessionUser } from '@/types/sessionUser';

const fetchUserData = async (userId: string) => {
  const { data } = await axios.get(`/api/users/${userId}`);
  return data;
};

export const useUserData = (userId: string) => {
  return useQuery(['user', userId], () => fetchUserData(userId), {
    enabled: !!userId, // userIdが存在する場合のみ実行
  });
}; 

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (user: Partial<SessionUser>) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_UPDATE_USER_URL;
      console.log('Updating user with data:', user); // デバッグ用にデータをログ出力
      const response = await axios.patch(`${apiUrl}/${user.id}`, user);
      return response.data;
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries('sessionUser');
      }
    }
  )
}