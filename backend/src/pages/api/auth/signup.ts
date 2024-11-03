// pages/api/auth/signup.ts

import { NextApiRequest, NextApiResponse } from 'next'
import query from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import * as yup from 'yup'

// バリデーションスキーマを作成
const schema = yup.object().shape({
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup
    .string()
    .min(8)
    .matches(/[a-z]/, 'Password must contain a lowercase letter')
    .matches(/[0-9]/, 'Password must contain a number')
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { username, email, password } = req.body

  try {
    // バリデーションを実行
    await schema.validate({ username, email, password })

    // パスワードのハッシュ化
    const passwordHash = await hashPassword(password)

    // ユーザーをデータベースに挿入
    await query(
      'INSERT INTO users (name, email, passwordHash) VALUES ($1, $2, $3)',
      [username, email, passwordHash]
    )

    res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ message: error.message })
    }
    res.status(500).json({ message: 'Registration failed', error })
  }
}
