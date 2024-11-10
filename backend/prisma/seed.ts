import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

// データベースに接続
const prisma = new PrismaClient();


async function main() {
  const password = await bcrypt.hash("password123", 10);

  // ユーザーを作成
  await prisma.user.createMany({
    data: [
      {
        name: "Sample User 1",
        email: "sample1@example.com",
        password: password,
        role: "admin",
      },
      {
        name: "Sample User 2",
        email: "sample2@example.com",
        password: password,
        role: "user",
      },
    ],
  });

  console.log("seedユーザーの作成が完了しました。");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
