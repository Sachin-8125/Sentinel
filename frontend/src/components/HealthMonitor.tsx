import { useState, useEffect } from "react";
import { Activity, Heart, Droplet, Thermometer } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { api } from "../lib/api";
import type { HealthReading } from "../types";
import { format } from "date-fns";

export default function HealthMonitor() {
  const [vitals, setVitals] = useState<HealthReading | null>(null);
  const [history, setHistory] = useState<HealthReading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [vitalsRes, historyRes] = await Promise.all([
        api.getLatestVitals(),
        api.getHealthHistory(1), //lasts 1 hour
      ]);
      setVitals(vitalsRes.vitals);
      setHistory(historyRes.readings);
    } catch (error) {
      console.error("Failed to load health data:", error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = history.map((reading) => ({
    time: format(new Date(reading.timestamp), "HH:mm"),
    heartRate: reading.heartRate,
    spO2: reading.sp02,
    temp: reading.skinTemp,
  }));

  const VitalCard = ({
    icon: Icon,
    label,
    value,
    unit,
    status,
  }: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
    unit: string;
    status: string;
  }) => (
    <div className="bg-teal-800/50 rounded-lg p-4 border border-teal-600">
      <div className="flex items-center gap-3 mb-2">
        <div
          className={`p-2 rounded-lg ${
            status === "critical"
              ? "bg-red-900/30"
              : status === "warning"
                ? "bg-yellow-900/30"
                : "bg-green-900/30"
          }`}
        >
          <Icon
            className={`w-5 h-5 ${
              status === "critical"
                ? "text-red-400"
                : status === "warning"
                  ? "text-yellow-400"
                  : "text-green-400"
            }`}
          />
        </div>
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-white">{value}</span>
        <span className="text-sm text-gray-400">{unit}</span>
      </div>
    </div>
  );

  const getStatus = (value: number, min: number, max: number) => {
    if (value < min * 0.85 || value > max * 1.15) return "critical";
    if (value < min || value > max) return "warning";
    return "normal";
  };

  if (loading || !vitals) {
    return (
      <div className="bg-teal-900/90 backdrop-blur-lg rounded-xl border border-teal-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-teal-300" />
          <h2 className="text-xl font-bold text-white">Health Monitoring</h2>
        </div>
        <div className="text-center py-12 text-gray-400">Loading vitals...</div>
      </div>
    );
  }

  return (
    <div className="bg-teal-900/90 backdrop-blur-lg rounded-xl border border-teal-700 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-teal-300" />
        <h2 className="text-xl font-bold text-white">Health Monitoring</h2>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400">Live</span>
        </div>
      </div>

      {/* Vital Signs Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <VitalCard
          icon={Heart}
          label="Heart Rate"
          value={vitals.heartRate.toFixed(0)}
          unit="BPM"
          status={getStatus(vitals.heartRate, 60, 100)}
        />
        <VitalCard
          icon={Droplet}
          label="SpO₂"
          value={vitals.sp02.toFixed(1)}
          unit="%"
          status={getStatus(vitals.sp02, 95, 100)}
        />
        <VitalCard
          icon={Activity}
          label="Blood Pressure"
          value={`${vitals.systolicBP.toFixed(0)}/${vitals.diastolicBP.toFixed(0)}`}
          unit="mmHg"
          status={getStatus(vitals.systolicBP, 90, 120)}
        />
        <VitalCard
          icon={Thermometer}
          label="Temperature"
          value={vitals.skinTemp.toFixed(1)}
          unit="°C"
          status={getStatus(vitals.skinTemp, 36, 37.5)}
        />
      </div>

      {/* Charts */}
      {chartData.length > 0 && (
        <div className="space-y-6">
          <div className="bg-teal-800/30 rounded-lg p-4 border border-teal-600/50">
            <h3 className="text-sm font-medium text-gray-300 mb-4">
              Heart Rate Trend
            </h3>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f766e" />
                <XAxis
                  dataKey="time"
                  stroke="#9ca3af"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="#9ca3af"
                  style={{ fontSize: "12px" }}
                  domain={[50, 120]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#134e4a",
                    border: "1px solid #0f766e",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#9ca3af" }}
                />
                <Line
                  type="monotone"
                  dataKey="heartRate"
                  stroke="#2dd4bf"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-teal-800/30 rounded-lg p-4 border border-teal-600/50">
            <h3 className="text-sm font-medium text-gray-300 mb-4">
              Blood Oxygen (SpO₂)
            </h3>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f766e" />
                <XAxis
                  dataKey="time"
                  stroke="#9ca3af"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="#9ca3af"
                  style={{ fontSize: "12px" }}
                  domain={[85, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#134e4a",
                    border: "1px solid #0f766e",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#9ca3af" }}
                />
                <Line
                  type="monotone"
                  dataKey="spO2"
                  stroke="#14b8a6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
