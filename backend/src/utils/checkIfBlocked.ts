import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const checkIfBlocked = async (userId: number): Promise<boolean> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        user_id: userId,
        banTill: { gt: new Date() },
      },
    });

    if (user) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error checking if user is blocked:", error);
    throw new Error("Internal server error");
  }
};
