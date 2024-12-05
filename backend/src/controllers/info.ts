import { Request } from "express";
import { cities, states } from "../utils/locations";

export const getContacts = (req, res) => {
  return res.json({ message: "Hello World" });
};

export const getStates = (req, res) => {
  return res.json(states);
};

export const getCities = (req, res) => {
  return res.json(cities);
};
