import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import {
  detectSystemAnomalies,
  generateRecommendation,
} from "../utils/anomalyDetection";

const prisma = new PrismaClient();

const systemReadingSchema = z.object({
  cabinCO2: z.number().min(0).max(50),
  cabinO2: z.number().min(0).max(100),
  cabinPressure: z.number().min(0).max(150),
  cabinTemp: z.number().min(-50).max(50),
  cabinHumidity: z.number().min(0).max(100),
  powerConsumption: z.number().min(0),
  waterReclamationLevel: z.number().min(0).max(100),
  wasteManagementLevel: z.number().min(0).max(100),
});

export const addSystemReading = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const validatedData = systemReadingSchema.parse(req.body);

    // Create system reading
    const reading = await prisma.systemReading.create({
      data: {
        userId,
        ...validatedData,
      },
    });

    // Detect anomalies
    const anomalies = detectSystemAnomalies(validatedData);

    // Create alerts if anomalies detected
    if (anomalies.length > 0) {
      for (const anomaly of anomalies) {
        await prisma.alert.create({
          data: {
            userId,
            type: anomaly.severity,
            category: anomaly.category || "SYSTEM",
            title: anomaly.title,
            message: anomaly.message,
            recommendation: generateRecommendation(anomaly.type, anomaly.value),
          },
        });
      }
    }

    res.status(201).json({
      reading,
      anomalies: anomalies.length > 0 ? anomalies : null,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: error.issues });
    }
    console.error("Add system reading error:", error);
    res.status(500).json({ error: "Failed to add system reading" });
  }
};

export const getSystemReadings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const limit = parseInt(req.query.limit as string) || 50;

    const readings = await prisma.systemReading.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
      take: limit,
    });

    res.json({ readings });
  } catch (error) {
    console.error("Get system readings error:", error);
    res.status(500).json({ error: "Failed to get system readings" });
  }
};

export const getSystemStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const latest = await prisma.systemReading.findFirst({
      where: { userId },
      orderBy: { timestamp: "desc" },
    });

    if (!latest) {
      return res.status(404).json({ error: "No system readings found" });
    }

    res.json({ status: latest });
  } catch (error) {
    console.error("Get system status error:", error);
    res.status(500).json({ error: "Failed to get system status" });
  }
};

export const getActiveAlerts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const alerts = await prisma.alert.findMany({
      where: {
        userId,
        resolved: false,
      },
      orderBy: { timestamp: "desc" },
    });

    res.json({ alerts });
  } catch (error) {
    console.error("Get active alerts error:", error);
    res.status(500).json({ error: "Failed to get active alerts" });
  }
};

export const resolveAlert = async (req: Request, res: Response) => {
  try {
    const { alertId } = req.params;

    const alert = await prisma.alert.update({
      where: { id: alertId },
      data: {
        resolved: true,
        resolvedAt: new Date(),
      },
    });

    res.json({ alert });
  } catch (error) {
    console.error("Resolve alert error:", error);
    res.status(500).json({ error: "Failed to resolve alert" });
  }
};

export const getAllAlerts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const limit = parseInt(req.query.limit as string) || 100;

    const alerts = await prisma.alert.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
      take: limit,
    });

    res.json({ alerts });
  } catch (error) {
    console.error("Get all alerts error:", error);
    res.status(500).json({ error: "Failed to get alerts" });
  }
};
