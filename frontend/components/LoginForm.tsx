import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from 'next/link'
import axios from 'axios';

// Yupでバリデーションスキーマを作成
const schema = yup.object().shape({
  email: yup.string().required('Email is required'),
  password: yup.string().required('Password is required'),
})

export default function UserLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    console.log("ApiUrl:", apiUrl)
  }, [])

  const onSubmit = async (data: any) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    
    try {
      await axios.post(`${apiUrl}/api/auth/login`, data)
      router.push('/') //ログイン成功時にリダイレクト
    } catch (err) {
      console.log('Login error:', err)  
      alert('Email or Password is invalid') //ログイン失敗時にアラートを表示
    }
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
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
          <div className="flex items-center justify-center w-full">
            <hr className="w-full border-t border-gray-300" />
            <span className="px-2 text-gray-500 text-sm">OR</span>
            <hr className="w-full border-t border-gray-300" />
          </div>
          <Button variant="outline" className="w-full">
            Continue with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}