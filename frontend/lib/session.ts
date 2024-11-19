import axios from 'axios';

export const fetchSession = async (cookie: string | undefined) => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const { data: user } = await axios.get(`${backendUrl}/auth/session`, {
      headers: {
        cookie: cookie || '',
      },
    });
    return user;
  } catch (error) {
    console.error('Error fetching session:', error);
    return null;
  }
};
