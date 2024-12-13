import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const checkPostLimit = async (userId: number): Promise<boolean> => {
  // Fetch the last three posts of the user
  const isUserVerified = await prisma.user.findFirst({
    where: {
      user_id: userId,
    },
    select: {
      verifiedByFollowersCount: true,
    },
  });

  if (isUserVerified.verifiedByFollowersCount) {
    const posts = await prisma.post.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: "desc",
      },
      take: 5, // Fetch only the last 3 posts
    });

    // Check if there are at least 3 posts
    if (posts.length < 5) {
      return false; // Allow posting as there are less than 3 posts
    }

    // Extract the dates of the last 3 posts
    const postDates = posts.map(
      (post) => post.created_at.toISOString().split("T")[0]
    );

    // Check if all 3 posts have the same date
    const allSameDay = postDates.every((date) => date === postDates[0]);

    return allSameDay; // Block if all 3 posts are on the same day
  } else {
    const posts = await prisma.post.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: "desc",
      },
      take: 3, // Fetch only the last 3 posts
    });

    // Check if there are at least 3 posts
    if (posts.length < 3) {
      return false; // Allow posting as there are less than 3 posts
    }

    // Extract the dates of the last 3 posts
    const postDates = posts.map(
      (post) => post.created_at.toISOString().split("T")[0]
    );

    // Check if all 3 posts have the same date
    const allSameDay = postDates.every((date) => date === postDates[0]);

    return allSameDay; // Block if all 3 posts are on the same day
  }
};
