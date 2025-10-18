import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { Rocket, LogOut, Activity, Cpu, AlertTriangle } from "lucide-react";
import HealthMonitor from "./HealthMonitor";
import SystemMonitor from "./SystemMonitor";
import AlertPanel from "./AlertPanel";
import type { User, Alert } from "../types";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
    loadAlerts();
    const interval = setInterval(loadAlerts, 10000); // Refresh alerts every 10s
    return () => clearInterval(interval);
  }, []);

  //load user
  const loadUser = async () => {
    try {
      const { user } = await api.getCurrentUser();
      setUser(user);
    } catch (error) {
      console.error("Failed to load user:", error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  //load alerts
  const loadAlerts = async () => {
    try {
      const { alerts } = await api.getActiveAlerts();
      setAlerts(alerts);
    } catch (error) {
      console.error("Failed to load alerts:", error);
    }
  };

  //handle logout
  const handleLogout = async () => {
    try {
      await api.logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const criticalAlerts = alerts.filter((a) => a.type === "CRITICAL").length;
  const warningAlerts = alerts.filter((a) => a.type === "WARNING").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-space-dark via-space-navy to-space-blue flex items-center justify-center">
        <div className="text-white text-xl">Loading Sentinel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-dark via-space-navy to-space-blue">
      {/* Header */}
      <header className="bg-space-navy/80 backdrop-blur-lg border-b border-space-blue/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-space-accent/20 rounded-lg flex items-center justify-center">
                <Rocket className="w-6 h-6 text-space-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Sentinel</h1>
                <p className="text-sm text-gray-400">
                  Real-Time Health & System Monitoring
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Status Summary */}
              <div className="hidden md:flex items-center gap-4">
                {criticalAlerts > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-space-danger/20 border border-space-danger/50 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-space-danger" />
                    <span className="text-sm font-medium text-space-danger">
                      {criticalAlerts} Critical
                    </span>
                  </div>
                )}
                {warningAlerts > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-space-warning/20 border border-space-warning/50 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-space-warning" />
                    <span className="text-sm font-medium text-space-warning">
                      {warningAlerts} Warning
                    </span>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400 capitalize">
                    {user?.role}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-space-blue/50 rounded-lg transition text-gray-300 hover:text-white"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Alerts */}
          <div className="xl:col-span-1">
            <AlertPanel alerts={alerts} onAlertResolved={loadAlerts} />
          </div>

          {/* Right Column - Monitors */}
          <div className="xl:col-span-2 space-y-6">
            <HealthMonitor />
            <SystemMonitor />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 pb-6 text-center">
        <p className="text-gray-500 text-sm">
          Team SignShell • Astra 2025 • Mission Time:{" "}
          {new Date().toISOString().split("T")[0]}
        </p>
      </footer>
    </div>
  );
}
