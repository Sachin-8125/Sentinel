import { Router } from "express";
import {
  addHealthReading,
  getHealthReadings,
  getLatestVitals,
  getHealthHistory,
} from "../controllers/healthController";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.post("/readings", addHealthReading);
router.get("/readings", getHealthReadings);
router.get("/vitals", getLatestVitals);
router.get("/history", getHealthHistory);

export default router;
