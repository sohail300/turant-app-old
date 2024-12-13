import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import multer from "multer";
import { addAd, getTotalActiveAds, searchAds } from "../controllers/ad";

const router = Router();

const upload = multer({ dest: "uploads/" });

router.get("/total-active-ads", authenticate, getTotalActiveAds);

router.post("/search-ads", authenticate, searchAds);

// router.delete("/view-details", authenticate, viewDetails);

router.post("/add-ad", authenticate, upload.single("file"), addAd);

export default router;
