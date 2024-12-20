import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationSettings } from './NotificationSettings';
import { AccountSettings } from './AccountSettings';
import { LogoutButton } from './LogoutButton';
import { DeleteAccountButton } from './DeleteAccountButton';
import { SessionUser } from '@/types/sessionUser';
import { useUpdateUser } from '@/hooks/useUser';

const userSettingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Please enter a valid email address"),
  bio: z.string().max(160, "Bio must be within 160 characters").nullable(),
  avatar: z.string().optional(),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
});

type UserSettingsValues = z.infer<typeof userSettingsSchema>;

interface UserSettingsProps {
  user: SessionUser;
}

const UserSettings: React.FC<UserSettingsProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const updateUser = useUpdateUser();

  const form = useForm<UserSettingsValues>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: user,
  });

  const onSubmit: SubmitHandler<UserSettingsValues> = (data) => {
    const userData = {
      name: data.name,
      email: data.email,
      bio: data.bio ?? undefined,
      avatar: data.avatar ?? undefined,
      emailNotifications: data.emailNotifications,
      pushNotifications: data.pushNotifications,
    };

    updateUser.mutate(userData, {
      onSuccess: () => {
        setIsEditing(false);
        console.log('User updated successfully');
      },
      onError: (error) => {
        console.error('Failed to update user:', error);
      },
    });
  };

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.avatar || ''} alt={user.name} />
              <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name} Settings</CardTitle>
              <CardDescription>Manage account and notification settings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="account">
            <TabsList className="grid w-full grid-cols-2 border-b">
              <TabsTrigger value="account" className="p-2 hover:bg-gray-100 focus:ring-2 ring-blue-500">
                Account
              </TabsTrigger>
              <TabsTrigger value="notifications" className="p-2 hover:bg-gray-100 focus:ring-2 ring-blue-500">
                Notifications
              </TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <AccountSettings form={form} isEditing={isEditing} setIsEditing={setIsEditing} handleSubmit={handleSubmit} />
              <div className="mt-8 space-y-4">
                <LogoutButton />
                <DeleteAccountButton />
              </div>
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationSettings form={form} handleSubmit={handleSubmit} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSettings;
