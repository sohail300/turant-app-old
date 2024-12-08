import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const checkIfBlocked = async (userId: number): Promise<boolean> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        user_id: userId,
      },
      select: {
        status: true,
      },
    });

    if (!user) {
      return false;
    }

    return user.status === "ban";
  } catch (error) {
    console.error("Error checking if user is blocked:", error);
    throw new Error("Internal server error");
  }
};
