import { AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { api } from "../lib/api";
import type { Alert } from "../types";
import { formatDistanceToNow } from "date-fns";

interface AlertPanelProps {
  alerts: Alert[];
  onAlertResolved: () => void;
}
export default function AlertPanel({
  alerts,
  onAlertResolved,
}: AlertPanelProps) {
  const handleResolve = async (alertId: string) => {
    try {
      await api.resolveAlert(alertId);
      onAlertResolved();
    } catch (error) {
      console.error("Failed to resolve alert", error);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "CRITICAL":
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case "WARNING":
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      default:
        return <Info className="w-5 h-5 text-teal-400" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "CRITICAL":
        return "bg-red-900/30 border-red-600";
      case "WARNING":
        return "bg-yellow-900/30 border-yellow-600";
      default:
        return "bg-teal-900/30 border-teal-600";
    }
  };

  return (
    <div className="bg-teal-900/90 backdrop-blur-lg rounded-xl border border-teal-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-teal-300" />
          <h2 className="text-xl font-bold text-white">Active Alerts</h2>
        </div>
        <div className="px-3 py-1 bg-teal-800 rounded-full">
          <span className="text-sm font-medium text-teal-300">
            {alerts.length}
          </span>
        </div>
      </div>

      <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-gray-400">All systems nominal</p>
            <p className="text-sm text-gray-500 mt-1">No active alerts</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 border rounded-lg ${getAlertColor(alert.type)}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white">
                        {alert.title}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          alert.type === "CRITICAL"
                            ? "bg-red-600 text-white"
                            : alert.type === "WARNING"
                              ? "bg-yellow-600 text-white"
                              : "bg-teal-600 text-white"
                        }`}
                      >
                        {alert.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">
                      {alert.message}
                    </p>
                    <div className="p-2 bg-teal-800/30 rounded border border-teal-600/50">
                      <p className="text-xs font-medium text-teal-300 mb-1">
                        Recommended Action:
                      </p>
                      <p className="text-xs text-gray-300">
                        {alert.recommendation}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatDistanceToNow(new Date(alert.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleResolve(alert.id)}
                  className="p-1.5 hover:bg-teal-700/50 rounded transition flex-shrink-0"
                  title="Resolve alert"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-white" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(15, 118, 110, 0.3);
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(45, 212, 191, 0.3);
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(45, 212, 191, 0.5);
            }
          `}</style>
    </div>
  );
}
