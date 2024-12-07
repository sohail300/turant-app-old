import { PrismaClient } from "@prisma/client";
import { states } from "../utils/locations";
import axios from "axios";

const prisma = new PrismaClient();

export const getContacts = async (req, res) => {
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

    if (!reporters.length) {
      return res.status(404).json({ message: "No reporters found" });
    }

    // Respond with the list of reporters
    return res.json({
      reporters,
    });
  } catch (error) {
    console.error("Error fetching reporters:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getStates = (req, res) => {
  return res.json(states);
};

export const getCities = async (req, res) => {
  try {
    const { state } = req.query;

    if (!state) {
      return res.status(400).json({ message: "State is required" });
    }

    const cities = await axios.post(
      "https://countriesnow.space/api/v0.1/countries/state/cities",
      {
        country: "India",
        state: state,
      }
    );

    console.log(cities);

    return res.json(cities);
  } catch (error) {
    console.error("Error fetching reporters:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
