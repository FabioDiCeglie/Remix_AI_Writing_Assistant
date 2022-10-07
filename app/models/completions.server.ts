import { User } from "@prisma/client";
import { prisma } from "~/db.server";
export type { User } from "@prisma/client";

export const getMostRecentCompletion = (userId: User["id"]) => {
  return prisma.completion.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
};

export const addCompletion = ({
  userId,
  aiCompletion,
  prompt,
  token,
}: {
  userId: User["id"];
  aiCompletion: string;
  prompt: string;
  token: Number;
}) => {
  return prisma.completion.create({
    data: {
      prompt,
      answer: aiCompletion,
      token: Number(token),
      user: {
        connect: { id: String(userId) },
      },
    },
  });
};
