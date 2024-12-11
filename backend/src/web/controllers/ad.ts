import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { addAdSchema } from "../zod/ad/addAd";
import { searchUserSchema } from "../zod/user/searchUser";
import { searchAdSchema } from "../zod/ad/searchAd";

const prisma = new PrismaClient();

export const getTotalActiveAds = async (req: Request, res: Response) => {
  try {
    const getTotalActiveAds = await prisma.ad.count();

    res.json({
      getTotalActiveAds,
    });
  } catch (error) {
    console.error("Error getting total users:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const searchAds = async (req: Request, res: Response) => {
  try {
    const inputData = searchAdSchema.safeParse(req.body);

    if (!inputData.success) {
      res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
      return;
    }

    const { identifier, timeFilter, limit, offset } = inputData.data;

    const currentDate = new Date();
    // Define filters with correct Prisma type
    const filters: Prisma.AdWhereInput = {
      company_name: {
        contains: identifier,
        mode: Prisma.QueryMode.insensitive, // Use Prisma.QueryMode for the `mode`
      },
    };

    // Add timeFilter logic
    if (timeFilter === "active") {
      filters.end_date = { gte: currentDate }; // end_date should be greater than or equal to the current date
      filters.start_date = { lte: currentDate }; // start_date should be less than or equal to the current date
    } else if (timeFilter === "scheduled") {
      filters.start_date = { gt: currentDate }; // start_date should be greater than the current date
    } else if (timeFilter === "past") {
      filters.end_date = { lt: currentDate }; // end_date should be less than the current date
    }

    // Search for users by username or name
    const ads = await prisma.ad.findMany({
      where: filters,
      select: {
        company_name: true,
        start_date: true,
        end_date: true,
        duration: true,
        target_state: true,
        target_city: true,
        cost: true,
        _count: {
          select: {
            ad_views: true,
            ad_clicks: true,
          },
        },
      },
      take: limit,
      skip: offset,
    });

    // Search for users by username or name
    const totalAds = await prisma.ad.count({
      where: filters,
    });

    res.json({
      ads,
      totalAds,
    });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const addAd = async (req: Request, res: Response) => {
  try {
    const inputData = addAdSchema.safeParse(req.body);
    const image = req.file;
    console.log(req.body);
    console.log(image);

    if (!inputData.success) {
      console.log(inputData.error.issues);
      res.status(400).json({
        error: inputData.error.issues[0].message,
      });
      return;
    }

    const {
      name,
      media_type,
      target_url,
      start_date,
      end_date,
      duration,
      state,
      city,
      cost,
    } = inputData.data;

    console.log(image);

    const ad = await prisma.ad.create({
      data: {
        company_name: name,
        media_type,
        target_url,
        start_date,
        end_date,
        duration,
        target_state: state,
        target_city: city,
        cost,
        media_link:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/1200px-User_icon_2.svg.png",
      },
    });

    res.json({
      message: "Ad added successfully",
    });
  } catch (error) {
    console.error("Error adding reporter:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
