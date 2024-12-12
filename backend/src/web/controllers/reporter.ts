import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { searchUserSchema } from "../zod/user/searchUser";
import { addReporterSchema } from "../zod/user/addReporter";
import { states } from "../../utils/locations";
import axios from "axios";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const prisma = new PrismaClient();

// Configure AWS S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const getTotalReporters = async (req: Request, res: Response) => {
  try {
    const totalReporters = await prisma.reporter.count();

    res.json({
      totalReporters,
    });
  } catch (error) {
    console.error("Error getting total users:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const searchReporters = async (req: Request, res: Response) => {
  try {
    const inputData = searchUserSchema.safeParse(req.body);

    if (!inputData.success) {
      res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
      return;
    }

    const { identifier, limit, offset } = inputData.data;

    // Search for users by username or name
    const users = await prisma.reporter.findMany({
      where: {
        name: { contains: identifier, mode: "insensitive" },
      },
      select: {
        reporter_id: true,
        name: true,
        image: true,
        phone: true,
        state: true,
        district: true,
        block: true,
      },
      take: limit,
      skip: offset,
    });

    // Search for users by username or name
    const totalReporters = await prisma.reporter.count({
      where: {
        name: { contains: identifier, mode: "insensitive" },
      },
    });

    res.json({
      users,
      totalReporters,
    });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const addReporter = async (req: Request, res: Response) => {
  try {
    const inputData = addReporterSchema.safeParse(req.body);
    const image = req.file;

    if (!inputData.success) {
      res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
      return;
    }

    const { name, phone, state, district, block } = inputData.data;

    console.log(name);
    console.log(image);

    const phoneAlreadyExists = await prisma.reporter.findFirst({
      where: {
        phone,
      },
    });

    if (phoneAlreadyExists) {
      res.status(400).json({
        message: "Phone number already exists",
      });
      return;
    }

    // Upload image to S3
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `reporters/${Date.now()}_${image.originalname}`, // Path in the S3 bucket
      Body: image.buffer,
      ContentType: image.mimetype,
      ACL: "private", // Keep the file private
    });

    await s3Client.send(command);

    const reporter = await prisma.reporter.create({
      data: {
        name,
        phone,
        state,
        district,
        block,
        image: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${image.filename}`,
      },
    });

    res.json({
      message: "Reporter added successfully",
    });
  } catch (error) {
    console.error("Error adding reporter:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteReporter = async (req: Request, res: Response) => {
  try {
    const { reporterId } = req.query;

    const reporter = await prisma.reporter.findUnique({
      where: {
        reporter_id: Number(reporterId),
      },
    });

    if (!reporter) {
      res.status(404).json({
        message: "Reporter not found",
      });
      return;
    }

    await prisma.reporter.delete({
      where: {
        reporter_id: Number(reporterId),
      },
    });

    res.json({
      message: "Reporter deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting reporter:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getStates = (req: Request, res: Response) => {
  res.json({ states });
};

export const getCities = async (req: Request, res: Response) => {
  try {
    const { state } = req.query;
    console.log(state);

    if (!state) {
      res.status(400).json({ message: "State is required" });
    }

    const response = await axios.post(
      "https://countriesnow.space/api/v0.1/countries/state/cities",
      {
        country: "India",
        state: state,
      }
    );

    console.log(response.data.data);

    res.json({ cities: response.data.data });
  } catch (error) {
    console.error("Error fetching reporters:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
