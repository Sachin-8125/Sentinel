import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import {
  detectHealthAnomalies,
  generateRecommendation,
} from "../utils/anomalyDetection";

const prisma = new PrismaClient();

const healthReadingSchema = z.object({
  heartRate: z.number().min(30).max(220),
  spO2: z.number().min(70).max(100),
  systolicBP: z.number().min(70).max(200),
  diastolicBP: z.number().min(40).max(130),
  skinTemp: z.number().min(35).max(42),
  respiratoryRate: z.number().min(8).max(40).optional(),
});

//add health readings
export const addHealthReading = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const validatedData = healthReadingSchema.parse(req.body);

    // Create health reading
    const reading = await prisma.healthReading.create({
      data: {
        userId,
        ...validatedData,
      },
    });

    // Detect anomalies
    const anomalies = detectHealthAnomalies(validatedData);

    // Create alerts if anomalies detected
    if (anomalies.length > 0) {
      for (const anomaly of anomalies) {
        await prisma.alert.create({
          data: {
            userId,
            type: anomaly.severity,
            category: "HEALTH",
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
    console.error("Add health reading error:", error);
    res.status(500).json({ error: "Failed to add health reading" });
  }
};

//get health readings
export const getHealthReadings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const limit = parseInt(req.query.limit as string) || 50;

    const readings = await prisma.healthReading.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
      take: limit,
    });

    res.json({ readings });
  } catch (error) {
    console.error("Get health readings error:", error);
    res.status(500).json({ error: "Failed to get health readings" });
  }
};

// getting latest vitals
export const getLatestVitals = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const latest = await prisma.healthReading.findFirst({
      where: { userId },
      orderBy: { timestamp: "desc" },
    });

    if (!latest) {
      return res.status(404).json({ error: "No health readings found" });
    }

    res.json({ vitals: latest });
  } catch (error) {
    console.error("Get latest vitals error:", error);
    res.status(500).json({ error: "Failed to get latest vitals" });
  }
};

//getting health history
export const getHealthHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const hours = parseInt(req.query.hours as string) || 24;

    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - hours);

    const readings = await prisma.healthReading.findMany({
      where: {
        userId,
        timestamp: { gte: cutoffTime },
      },
      orderBy: { timestamp: "asc" },
    });

    res.json({ readings, hours });
  } catch (error) {
    console.error("Get health history error:", error);
    res.status(500).json({ error: "Failed to get health history" });
  }
};
