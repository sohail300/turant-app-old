import { verifyAccessToken } from "../utils/jwtMethods";
import { NextFunction, Request, Response } from "express";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);

    if (decoded) {
      req.headers.userId = decoded.userId.toString();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
