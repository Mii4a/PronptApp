import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: { 
      id: number; 
      name: string;
      email: string;
      bio: string | null;
      avatar: string | null; 
      emailNotifications: boolean;
      pushNotifications: boolean;
    };
  };
};
