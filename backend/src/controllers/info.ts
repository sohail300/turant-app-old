import { PrismaClient } from "@prisma/client";
import { states } from "../utils/locations";
import axios from "axios";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getContacts = async (req: Request, res: Response) => {
  try {
    // Fetch all reporters
    const reporters = await prisma.reporter.findMany({
      select: {
        reporter_id: true,
        name: true,
        phone: true,
        state: true,
        district: true,
        block: true,
        image: true,
      },
    });

    // Respond with the list of reporters
    res.json({
      reporters,
    });
  } catch (error) {
    console.error("Error fetching reporters:", error);
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
      return;
    }

    const response = await axios.post(
      "https://countriesnow.space/api/v0.1/countries/state/cities",
      {
        country: "India",
        state: state,
      }
    );

    console.log(response.data.data);
    const formattedCities = response.data.data.map((city) => ({
      label: city,
      value: city
        .toLowerCase()
        .normalize("NFD") // Normalize to decompose diacritics
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritic marks
        .replace(/\s+/g, "_"), // Replace spaces with underscores
    }));

    console.log(formattedCities);

    res.json({ cities: formattedCities });
  } catch (error) {
    console.error("Error fetching reporters:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
