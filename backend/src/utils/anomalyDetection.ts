interface HealthReading {
  heartRate: number;
  spO2: number;
  systolicBP: number;
  diastolicBP: number;
  skinTemp: number;
  respiratoryRate?: number;
}

interface SystemReading {
  cabinCO2: number;
  cabinO2: number;
  cabinPressure: number;
  cabinTemp: number;
  cabinHumidity: number;
  powerConsumption: number;
  waterReclamationLevel: number;
  wasteManagementLevel: number;
}

interface Anomaly {
  type: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  category?: string;
  title: string;
  message: string;
  value: number;
}

// Health thresholds
const HEALTH_THRESHOLDS = {
  heartRate: { min: 60, max: 100, critical_min: 40, critical_max: 120 },
  spO2: { min: 95, critical_min: 88 },
  systolicBP: { min: 90, max: 120, critical_min: 70, critical_max: 140 },
  diastolicBP: { min: 60, max: 80, critical_min: 40, critical_max: 90 },
  skinTemp: { min: 36, max: 37.5, critical_min: 35, critical_max: 39 },
  respiratoryRate: { min: 12, max: 20, critical_min: 8, critical_max: 30 },
};

// System thresholds
const SYSTEM_THRESHOLDS = {
  cabinCO2: { max: 7, critical_max: 10 },
  cabinO2: { min: 19.5, max: 23.5, critical_min: 18, critical_max: 25 },
  cabinPressure: { min: 95, max: 105, critical_min: 90, critical_max: 110 },
  cabinTemp: { min: 18, max: 27, critical_min: 15, critical_max: 30 },
  cabinHumidity: { min: 30, max: 70, critical_min: 20, critical_max: 80 },
  waterReclamationLevel: { min: 20, critical_min: 10 },
  wasteManagementLevel: { max: 80, critical_max: 95 },
};

export const detectHealthAnomalies = (reading: HealthReading): Anomaly[] => {
  const anomalies: Anomaly[] = [];

  // Heart Rate
  if (
    reading.heartRate < HEALTH_THRESHOLDS.heartRate.critical_min ||
    reading.heartRate > HEALTH_THRESHOLDS.heartRate.critical_max
  ) {
    anomalies.push({
      type: "HEART_RATE",
      severity: "CRITICAL",
      title: "Critical Heart Rate",
      message: `Heart rate is ${reading.heartRate} BPM, outside safe range.`,
      value: reading.heartRate,
    });
  } else if (
    reading.heartRate < HEALTH_THRESHOLDS.heartRate.min ||
    reading.heartRate > HEALTH_THRESHOLDS.heartRate.max
  ) {
    anomalies.push({
      type: "HEART_RATE",
      severity: "WARNING",
      title: "Abnormal Heart Rate",
      message: `Heart rate is ${reading.heartRate} BPM, outside normal range.`,
      value: reading.heartRate,
    });
  }

  // SpO2
  if (reading.spO2 < HEALTH_THRESHOLDS.spO2.critical_min) {
    anomalies.push({
      type: "SPO2",
      severity: "CRITICAL",
      title: "Critical Blood Oxygen Level",
      message: `SpO₂ is ${reading.spO2}%, critically low.`,
      value: reading.spO2,
    });
  } else if (reading.spO2 < HEALTH_THRESHOLDS.spO2.min) {
    anomalies.push({
      type: "SPO2",
      severity: "WARNING",
      title: "Low Blood Oxygen",
      message: `SpO₂ is ${reading.spO2}%, below normal range.`,
      value: reading.spO2,
    });
  }

  // Blood Pressure
  if (
    reading.systolicBP < HEALTH_THRESHOLDS.systolicBP.critical_min ||
    reading.systolicBP > HEALTH_THRESHOLDS.systolicBP.critical_max
  ) {
    anomalies.push({
      type: "BLOOD_PRESSURE",
      severity: "CRITICAL",
      title: "Critical Blood Pressure",
      message: `Systolic BP is ${reading.systolicBP} mmHg, critically abnormal.`,
      value: reading.systolicBP,
    });
  } else if (
    reading.systolicBP < HEALTH_THRESHOLDS.systolicBP.min ||
    reading.systolicBP > HEALTH_THRESHOLDS.systolicBP.max
  ) {
    anomalies.push({
      type: "BLOOD_PRESSURE",
      severity: "WARNING",
      title: "Abnormal Blood Pressure",
      message: `Systolic BP is ${reading.systolicBP} mmHg, outside normal range.`,
      value: reading.systolicBP,
    });
  }

  // Skin Temperature
  if (
    reading.skinTemp < HEALTH_THRESHOLDS.skinTemp.critical_min ||
    reading.skinTemp > HEALTH_THRESHOLDS.skinTemp.critical_max
  ) {
    anomalies.push({
      type: "TEMPERATURE",
      severity: "CRITICAL",
      title: "Critical Body Temperature",
      message: `Skin temperature is ${reading.skinTemp}°C, critically abnormal.`,
      value: reading.skinTemp,
    });
  } else if (
    reading.skinTemp < HEALTH_THRESHOLDS.skinTemp.min ||
    reading.skinTemp > HEALTH_THRESHOLDS.skinTemp.max
  ) {
    anomalies.push({
      type: "TEMPERATURE",
      severity: "WARNING",
      title: "Abnormal Body Temperature",
      message: `Skin temperature is ${reading.skinTemp}°C, outside normal range.`,
      value: reading.skinTemp,
    });
  }

  return anomalies;
};

export const detectSystemAnomalies = (reading: SystemReading): Anomaly[] => {
  const anomalies: Anomaly[] = [];

  // Cabin CO2
  if (reading.cabinCO2 > SYSTEM_THRESHOLDS.cabinCO2.critical_max) {
    anomalies.push({
      type: "CABIN_CO2",
      severity: "CRITICAL",
      category: "ENVIRONMENT",
      title: "Critical CO₂ Level",
      message: `Cabin CO₂ is ${reading.cabinCO2} mmHg, critically high.`,
      value: reading.cabinCO2,
    });
  } else if (reading.cabinCO2 > SYSTEM_THRESHOLDS.cabinCO2.max) {
    anomalies.push({
      type: "CABIN_CO2",
      severity: "WARNING",
      category: "ENVIRONMENT",
      title: "Elevated CO₂ Level",
      message: `Cabin CO₂ is ${reading.cabinCO2} mmHg, above normal.`,
      value: reading.cabinCO2,
    });
  }

  // Cabin O2
  if (
    reading.cabinO2 < SYSTEM_THRESHOLDS.cabinO2.critical_min ||
    reading.cabinO2 > SYSTEM_THRESHOLDS.cabinO2.critical_max
  ) {
    anomalies.push({
      type: "CABIN_O2",
      severity: "CRITICAL",
      category: "ENVIRONMENT",
      title: "Critical Oxygen Level",
      message: `Cabin O₂ is ${reading.cabinO2}%, critically abnormal.`,
      value: reading.cabinO2,
    });
  } else if (
    reading.cabinO2 < SYSTEM_THRESHOLDS.cabinO2.min ||
    reading.cabinO2 > SYSTEM_THRESHOLDS.cabinO2.max
  ) {
    anomalies.push({
      type: "CABIN_O2",
      severity: "WARNING",
      category: "ENVIRONMENT",
      title: "Abnormal Oxygen Level",
      message: `Cabin O₂ is ${reading.cabinO2}%, outside normal range.`,
      value: reading.cabinO2,
    });
  }

  // Water Reclamation
  if (
    reading.waterReclamationLevel <
    SYSTEM_THRESHOLDS.waterReclamationLevel.critical_min
  ) {
    anomalies.push({
      type: "WATER_LEVEL",
      severity: "CRITICAL",
      category: "SYSTEM",
      title: "Critical Water Level",
      message: `Water reclamation at ${reading.waterReclamationLevel}%, critically low.`,
      value: reading.waterReclamationLevel,
    });
  } else if (
    reading.waterReclamationLevel < SYSTEM_THRESHOLDS.waterReclamationLevel.min
  ) {
    anomalies.push({
      type: "WATER_LEVEL",
      severity: "WARNING",
      category: "SYSTEM",
      title: "Low Water Level",
      message: `Water reclamation at ${reading.waterReclamationLevel}%, below normal.`,
      value: reading.waterReclamationLevel,
    });
  }

  // Waste Management
  if (
    reading.wasteManagementLevel >
    SYSTEM_THRESHOLDS.wasteManagementLevel.critical_max
  ) {
    anomalies.push({
      type: "WASTE_LEVEL",
      severity: "CRITICAL",
      category: "SYSTEM",
      title: "Critical Waste Level",
      message: `Waste management at ${reading.wasteManagementLevel}%, critically high.`,
      value: reading.wasteManagementLevel,
    });
  } else if (
    reading.wasteManagementLevel > SYSTEM_THRESHOLDS.wasteManagementLevel.max
  ) {
    anomalies.push({
      type: "WASTE_LEVEL",
      severity: "WARNING",
      category: "SYSTEM",
      title: "High Waste Level",
      message: `Waste management at ${reading.wasteManagementLevel}%, above normal.`,
      value: reading.wasteManagementLevel,
    });
  }

  return anomalies;
};

export const generateRecommendation = (type: string, value: number): string => {
  const recommendations: Record<string, string> = {
    HEART_RATE:
      "Monitor astronaut closely. Consider medical evaluation. Reduce physical activity.",
    SPO2: "Administer supplemental oxygen immediately. Check life support systems. Initiate medical protocol.",
    BLOOD_PRESSURE:
      "Initiate cardiovascular monitoring. Review medication. Consult flight surgeon.",
    TEMPERATURE:
      "Check thermal regulation systems. Administer fluids if fever. Initiate medical assessment.",
    CABIN_CO2:
      "Activate CO₂ scrubbers immediately. Check ventilation systems. Verify LiOH cartridges.",
    CABIN_O2:
      "Check oxygen generation system. Verify O₂ supply levels. Activate backup systems if needed.",
    WATER_LEVEL:
      "Prepare for water conservation mode. Check recycling system. Review water usage protocols.",
    WASTE_LEVEL:
      "Schedule immediate waste disposal. Check waste management system integrity. Initiate cleanup protocol.",
  };

  return (
    recommendations[type] ||
    "Monitor situation closely and follow standard operating procedures."
  );
};
