import { Router } from "express";
import { getCities, getContacts, getStates } from "../controllers/info";

const router = Router();

router.get("/contact", getContacts);

router.get("/get-states", getStates);

router.get("/get-cities", getCities);

// router.get("/get-ads", getAds);

export default router;
