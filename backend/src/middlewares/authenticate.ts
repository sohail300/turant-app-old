import { verifyAccessToken } from "../utils/jwtMethods";

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = verifyAccessToken(token);

    if (decoded) {
      req.userId = decoded.userId;
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
