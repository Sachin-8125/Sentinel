import { useState, useEffect } from "react";
import { Cpu, Wind, Droplets, Zap, Gauge } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { api } from "../lib/api";
import type { SystemReading } from "../types";
import { format } from "date-fns";

export default function SystemMonitor() {
  const [status, setStatus] = useState<SystemReading | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const statusRes = await api.getSystemStatus();
      setStatus(statusRes.status);
    } catch (error) {
      console.error("Failed to load system data:", error);
    } finally {
      setLoading(false);
    }
  };

  //System Card
  const SystemCard = ({ icon: Icon, label, value, unit, status, max }: any) => {
    const percentage = max ? (value / max) * 100 : value;
    const getColor = () => {
      if (status === "critical") return "bg-space-danger";
      if (status === "warning") return "bg-space-warning";
      return "bg-space-success";
    };

    return (
      <div className="bg-space-dark/30 rounded-lg p-4 border border-space-blue/20">
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`p-2 rounded-lg ${
              status === "critical"
                ? "bg-space-danger/20"
                : status === "warning"
                  ? "bg-space-warning/20"
                  : "bg-space-success/20"
            }`}
          >
            <Icon
              className={`w-5 h-5 ${
                status === "critical"
                  ? "text-space-danger"
                  : status === "warning"
                    ? "text-space-warning"
                    : "text-space-success"
              }`}
            />
          </div>
          <span className="text-sm text-gray-400">{label}</span>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold text-white">{value}</span>
          <span className="text-sm text-gray-400">{unit}</span>
        </div>
        {max && (
          <div className="w-full bg-space-dark rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getColor()}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        )}
      </div>
    );
  };

  //atmosphere status
  const getAtmosphereStatus = (co2: number, o2: number) => {
    if (co2 > 10 || o2 < 18 || o2 > 25) return "critical";
    if (co2 > 7 || o2 < 19.5 || o2 > 23.5) return "warning";
    return "normal";
  };

  //resource status
  const getResourceStatus = (level: number, isWaste = false) => {
    if (isWaste) {
      if (level > 95) return "critical";
      if (level > 80) return "warning";
      return "normal";
    } else {
      if (level < 10) return "critical";
      if (level < 20) return "warning";
      return "normal";
    }
  };

  //system loading
  if (loading || !status) {
    return (
      <div className="bg-space-navy/60 backdrop-blur-lg rounded-xl border border-space-blue/30 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Cpu className="w-5 h-5 text-space-accent" />
          <h2 className="text-xl font-bold text-white">System Monitoring</h2>
        </div>
        <div className="text-center py-12 text-gray-400">
          Loading system status...
        </div>
      </div>
    );
  }

  const atmosphereStatus = getAtmosphereStatus(status.cabinCO2, status.cabinO2);

  return (
    <div className="bg-space-navy/60 backdrop-blur-lg rounded-xl border border-space-blue/30 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Cpu className="w-5 h-5 text-space-accent" />
        <h2 className="text-xl font-bold text-white">System Monitoring</h2>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 bg-space-success rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400">Live</span>
        </div>
      </div>

      {/* Atmosphere Section */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          <Wind className="w-4 h-4" />
          Cabin Atmosphere
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SystemCard
            icon={Wind}
            label="CO₂ Level"
            value={status.cabinCO2.toFixed(1)}
            unit="mmHg"
            status={
              status.cabinCO2 > 10
                ? "critical"
                : status.cabinCO2 > 7
                  ? "warning"
                  : "normal"
            }
          />
          <SystemCard
            icon={Wind}
            label="O₂ Level"
            value={status.cabinO2.toFixed(1)}
            unit="%"
            status={
              status.cabinO2 < 18 || status.cabinO2 > 25
                ? "critical"
                : status.cabinO2 < 19.5 || status.cabinO2 > 23.5
                  ? "warning"
                  : "normal"
            }
          />
          <SystemCard
            icon={Gauge}
            label="Pressure"
            value={status.cabinPressure.toFixed(1)}
            unit="kPa"
            status={
              status.cabinPressure < 90 || status.cabinPressure > 110
                ? "critical"
                : status.cabinPressure < 95 || status.cabinPressure > 105
                  ? "warning"
                  : "normal"
            }
          />
          <SystemCard
            icon={Droplets}
            label="Humidity"
            value={status.cabinHumidity.toFixed(0)}
            unit="%"
            status={
              status.cabinHumidity < 20 || status.cabinHumidity > 80
                ? "critical"
                : status.cabinHumidity < 30 || status.cabinHumidity > 70
                  ? "warning"
                  : "normal"
            }
          />
        </div>
      </div>

      {/* Environmental Section */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          <Gauge className="w-4 h-4" />
          Environmental Controls
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <SystemCard
            icon={Gauge}
            label="Temperature"
            value={status.cabinTemp.toFixed(1)}
            unit="°C"
            status={
              status.cabinTemp < 15 || status.cabinTemp > 30
                ? "critical"
                : status.cabinTemp < 18 || status.cabinTemp > 27
                  ? "warning"
                  : "normal"
            }
          />
          <SystemCard
            icon={Zap}
            label="Power Usage"
            value={status.powerConsumption.toFixed(0)}
            unit="W"
            status="normal"
          />
        </div>
      </div>

      {/* Resources Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          <Droplets className="w-4 h-4" />
          Life Support Resources
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <SystemCard
            icon={Droplets}
            label="Water Reclamation"
            value={status.waterReclamationLevel.toFixed(0)}
            unit="%"
            max={100}
            status={getResourceStatus(status.waterReclamationLevel)}
          />
          <SystemCard
            icon={Cpu}
            label="Waste Management"
            value={status.wasteManagementLevel.toFixed(0)}
            unit="%"
            max={100}
            status={getResourceStatus(status.wasteManagementLevel, true)}
          />
        </div>
      </div>

      {/* Status Summary */}
      <div className="mt-6 p-4 bg-space-dark/30 rounded-lg border border-space-blue/20">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Overall System Status</span>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                atmosphereStatus === "critical"
                  ? "bg-space-danger"
                  : atmosphereStatus === "warning"
                    ? "bg-space-warning"
                    : "bg-space-success"
              } animate-pulse`}
            ></div>
            <span
              className={`text-sm font-semibold ${
                atmosphereStatus === "critical"
                  ? "text-space-danger"
                  : atmosphereStatus === "warning"
                    ? "text-space-warning"
                    : "text-space-success"
              } uppercase`}
            >
              {atmosphereStatus}
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Last updated: {format(new Date(status.timestamp), "PPpp")}
        </p>
      </div>
    </div>
  );
}
