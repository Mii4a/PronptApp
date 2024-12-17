import { useQuery } from 'react-query';
import axios from 'axios';

const fetchUserData = async (userId: string) => {
  const { data } = await axios.get(`/api/users/${userId}`);
  return data;
};

export const useUserData = (userId: string) => {
  return useQuery(['user', userId], () => fetchUserData(userId), {
    enabled: !!userId, // userIdが存在する場合のみ実行
  });
}; 