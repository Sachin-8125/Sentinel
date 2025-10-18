import { Router } from "express";
import {
  addSystemReading,
  getSystemReadings,
  getSystemStatus,
  getActiveAlerts,
  resolveAlert,
  getAllAlerts,
} from "../controllers/systemController";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// System readings
router.post("/readings", addSystemReading);
router.get("/readings", getSystemReadings);
router.get("/status", getSystemStatus);

// Alerts
router.get("/alerts", getActiveAlerts);
router.get("/alerts/all", getAllAlerts);
router.patch("/alerts/:alertId/resolve", resolveAlert);

export default router;
