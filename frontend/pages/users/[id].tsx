import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import UserSettings from '@/components/UserSettings';
import { useUserData } from '@/hooks/useUserData';

const UserPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth);

  return (
    <div>
      <UserSettings user={user} />
    </div>
  );
};

export default UserPage;