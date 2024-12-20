import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from 'next/link';
import { useLogin } from '@/hooks/useAuth';

// components
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from './Header';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleOAuthButton } from "@/components/ui/oauth/GoogleOAuthButton";

// Yupでバリデーションスキーマを作成
const schema = yup.object().shape({
  email: yup.string().required('Email is required'),
  password: yup.string().required('Password is required'),
})

export default function UserLoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })
  const { login } = useLogin();

  const onSubmit = async (data: any) => {
    await login(data.email, data.password);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Log In</CardTitle>
          <CardDescription>Welcome back! Please log in to your account.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && (
                <Alert variant="destructive">
                  <AlertDescription id="email-error">{errors.email.message as string}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password', {required: 'Password is required'})}
              />
              {errors.password && (
                <Alert variant="destructive">
                  <AlertDescription id="password-error">{errors.password.message as string}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full">Log In</Button>
          </form>

        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
          <div className="flex items-center justify-center w-full">
            <hr className="w-full border-t border-gray-300" />
            <span className="px-2 text-gray-500 text-sm">OR</span>
            <hr className="w-full border-t border-gray-300" />
          </div>
          <GoogleOAuthButton />
        </CardFooter>
      </Card>
    </div>
  )
}