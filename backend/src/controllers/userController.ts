import { Request, Response} from 'express';
import prisma from '../lib/db';


export const updateUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);
  const { name, email, bio, avatar, emailNotifications, pushNotifications } = req.body;

  try {
    // 403 Forbidden: 他のユーザーの情報を更新しようとした場合
    if (req.session.user?.id !== userId) {
      return res.status(403).json({ error: 'You can only update your own profile' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email, bio, avatar, emailNotifications, pushNotifications },
    });

    // 200 OK: ユーザー情報が正常に更新された場合
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('Failed to update user:', err);

    // 500 Internal Server Error: サーバー内部でエラーが発生した場合
    res.status(500).json({ error: 'Failed to update user.' });
  }
};
