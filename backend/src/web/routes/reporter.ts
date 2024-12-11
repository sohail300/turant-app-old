import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import {
  getTotalReporters,
  searchReporters,
  addReporter,
  deleteReporter,
  getStates,
  getCities,
} from "../controllers/reporter";
import multer from "multer";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/total-reporters", authenticate, getTotalReporters);

router.post("/search-reporters", authenticate, searchReporters);

router.post("/add-reporter", authenticate, upload.single("image"), addReporter);

router.delete("/delete-reporter", authenticate, deleteReporter);

router.get("/get-states", getStates);

router.get("/get-cities", getCities);

export default router;
