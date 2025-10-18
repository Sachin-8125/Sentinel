import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import {
  detectHealthAnomalies,
  generateRecommendation,
} from "../utils/anomalyDetection";

const prisma = new PrismaClient();
