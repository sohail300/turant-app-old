import { Router } from "express";
import { getContacts } from "../controllers/info";

const router = Router();

router.get("/contact", getContacts);

export default router;
