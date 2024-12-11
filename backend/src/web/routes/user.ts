import { Router } from "express";
import {
  getTotalUsers,
  searchUsers,
  userAction,
  getActionDetails,
} from "../controllers/user";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.get("/total-users", authenticate, getTotalUsers);

router.post("/search-users", authenticate, searchUsers);

router.post("/action", authenticate, userAction);

router.post("/get-action-details", authenticate, getActionDetails);

export default router;
