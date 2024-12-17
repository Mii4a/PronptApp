import React from 'react';
import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NotificationSettings } from './NotificationSettings'
import { AccountSettings } from './AccountSettings'
import { LogoutButton } from './LogoutButton'
import { DeleteAccountButton } from './DeleteAccountButton'

const userSettingsSchema = z.object({
  name: z.string().min(2, "名前は2文字以上で入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  bio: z.string().max(160, "自己紹介は160文字以内で入力してください").optional(),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
})

type UserSettingsValues = z.infer<typeof userSettingsSchema>

const mockUser = {
  id: "1",
  name: "山田太郎",
  email: "taro.yamada@example.com",
  bio: "ウェブ開発者です。",
  avatar: "https://github.com/shadcn.png",
  emailNotifications: true,
  pushNotifications: false,
}

interface UserSettingsProps {
  user: {
    id: string;
    name: string;
    email: string;
    bio?: string;
    avatar: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
}

const UserSettings: React.FC<UserSettingsProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false)

  const form = useForm<UserSettingsValues>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: mockUser,
  })

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={mockUser.avatar} alt={user.name} />
              <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name}さんの設定</CardTitle>
              <CardDescription>アカウント設定と通知の管理</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="account">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">アカウント</TabsTrigger>
              <TabsTrigger value="notifications">通知</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <AccountSettings form={form} isEditing={isEditing} setIsEditing={setIsEditing} />
              <div className="mt-8 space-y-4">
                <LogoutButton />
                <DeleteAccountButton />
              </div>
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationSettings form={form} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserSettings;