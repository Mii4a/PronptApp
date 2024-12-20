export interface SessionUser {
  id: string
  email: string;
  password?: string;
  name: string;
  bio?: string | null;
  avatar?: string | undefined;
  emailNotifications: boolean;
  pushNotifications: boolean;
}
