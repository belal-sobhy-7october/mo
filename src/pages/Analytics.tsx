import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { Session, Client } from "../types";
import TabletLayout from "../components/TabletLayout";
import Navigation from "../components/Navigation";

const Analytics: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [selectedMetric, setSelectedMetric] = useState<string>("weight");

  useEffect(() => {
    // Load data from localStorage
    const loadedSessions = JSON.parse(localStorage.getItem("sessions") || "[]");
    const loadedClients = JSON.parse(localStorage.getItem("clients") || "[]");
    setSessions(loadedSessions);
    setClients(loadedClients);

    if (loadedClients.length > 0) {
      setSelectedClient(loadedClients[0].id);
    }
  }, []);

  const getClientSessions = (clientId: string) => {
    return sessions
      .filter((session) => session.clientId === clientId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getChartData = () => {
    const clientSessions = getClientSessions(selectedClient);

    if (selectedMetric === "weight") {
      return clientSessions.map((session) => ({
        date: new Date(session.date).toLocaleDateString(),
        weight: session.bodyComposition?.weight || 0,
        bodyFat: session.bodyComposition?.bodyFat || 0,
        muscleMass: session.bodyComposition?.muscleMass || 0,
      })) as any[];
    }

    if (selectedMetric === "measurements") {
      return clientSessions.map((session) => ({
        date: new Date(session.date).toLocaleDateString(),
        waist: session.measurements?.waist || 0,
        hips: session.measurements?.hips || 0,
        chest: session.measurements?.chest || 0,
        thigh: session.measurements?.thigh || 0,
        arm: session.measurements?.arm || 0,
      })) as any[];
    }

    if (selectedMetric === "benchmarks") {
      return clientSessions.map((session) => ({
        date: new Date(session.date).toLocaleDateString(),
        benchPress:
          session.benchmarks.find((b) => b.exercise === "bench-press")
            ?.weight || 0,
        squat:
          session.benchmarks.find((b) => b.exercise === "squat")?.weight || 0,
        deadlift:
          session.benchmarks.find((b) => b.exercise === "deadlift")?.weight ||
          0,
      })) as any[];
    }

    return [];
  };

  const calculateProgress = (data: number[]) => {
    if (data.length < 2) return { change: 0, percentage: 0, trend: "neutral" };

    const first = data[0];
    const last = data[data.length - 1];
    const change = last - first;
    const percentage = first !== 0 ? (change / first) * 100 : 0;

    return {
      change,
      percentage,
      trend: change > 0 ? "up" : change < 0 ? "down" : "neutral",
    };
  };

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client?.name || "Unknown Client";
  };

  const chartData = getChartData();
  const clientSessions = getClientSessions(selectedClient);

  return (
    <TabletLayout sidebar={<Navigation />}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-16">
          <Activity size={64} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">No client data available</p>
          <p className="text-gray-500 mt-2">
            Add clients and complete assessments to see analytics
          </p>
        </div>
      ) : (
        <>
          {/* Client and Metric Selection */}
          <div className="flex space-x-4 mb-8">
            <div className="flex-1">
              <label className="block text-white mb-2">Select Client</label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="input-field w-full"
              >
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-white mb-2">Select Metric</label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="input-field w-full"
              >
                <option value="weight">Body Composition</option>
                <option value="measurements">Measurements</option>
                <option value="benchmarks">Strength Benchmarks</option>
              </select>
            </div>
          </div>

          {/* Progress Summary Cards */}
          {chartData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {selectedMetric === "weight" && (
                <>
                  <div className="card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Weight</span>
                      {calculateProgress(chartData.map((d: any) => d.weight))
                        .trend === "down" ? (
                        <TrendingDown className="text-green-500" />
                      ) : (
                        <TrendingUp className="text-red-500" />
                      )}
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {(chartData[chartData.length - 1] as any)?.weight || 0} kg
                    </div>
                    <div className="text-sm text-gray-400">
                      {calculateProgress(
                        chartData.map((d: any) => d.weight),
                      ).change.toFixed(1)}{" "}
                      kg
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Body Fat</span>
                      {calculateProgress(chartData.map((d: any) => d.bodyFat))
                        .trend === "down" ? (
                        <TrendingDown className="text-green-500" />
                      ) : (
                        <TrendingUp className="text-red-500" />
                      )}
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {(chartData[chartData.length - 1] as any)?.bodyFat || 0}%
                    </div>
                    <div className="text-sm text-gray-400">
                      {calculateProgress(
                        chartData.map((d: any) => d.bodyFat),
                      ).change.toFixed(1)}
                      %
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Muscle Mass</span>
                      {calculateProgress(
                        chartData.map((d: any) => d.muscleMass),
                      ).trend === "up" ? (
                        <TrendingUp className="text-green-500" />
                      ) : (
                        <TrendingDown className="text-red-500" />
                      )}
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {(chartData[chartData.length - 1] as any)?.muscleMass ||
                        0}
                      %
                    </div>
                    <div className="text-sm text-gray-400">
                      {calculateProgress(
                        chartData.map((d: any) => d.muscleMass),
                      ).change.toFixed(1)}
                      %
                    </div>
                  </div>
                </>
              )}

              {selectedMetric === "measurements" && (
                <>
                  <div className="card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Waist</span>
                      {calculateProgress(chartData.map((d: any) => d.waist))
                        .trend === "down" ? (
                        <TrendingDown className="text-green-500" />
                      ) : (
                        <TrendingUp className="text-red-500" />
                      )}
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {(chartData[chartData.length - 1] as any)?.waist || 0} cm
                    </div>
                    <div className="text-sm text-gray-400">
                      {calculateProgress(
                        chartData.map((d: any) => d.waist),
                      ).change.toFixed(1)}{" "}
                      cm
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Chest</span>
                      {calculateProgress(chartData.map((d: any) => d.chest))
                        .trend === "up" ? (
                        <TrendingUp className="text-green-500" />
                      ) : (
                        <TrendingDown className="text-red-500" />
                      )}
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {(chartData[chartData.length - 1] as any)?.chest || 0} cm
                    </div>
                    <div className="text-sm text-gray-400">
                      {calculateProgress(
                        chartData.map((d: any) => d.chest),
                      ).change.toFixed(1)}{" "}
                      cm
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Thigh</span>
                      {calculateProgress(chartData.map((d: any) => d.thigh))
                        .trend === "up" ? (
                        <TrendingUp className="text-green-500" />
                      ) : (
                        <TrendingDown className="text-red-500" />
                      )}
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {(chartData[chartData.length - 1] as any)?.thigh || 0} cm
                    </div>
                    <div className="text-sm text-gray-400">
                      {calculateProgress(
                        chartData.map((d: any) => d.thigh),
                      ).change.toFixed(1)}{" "}
                      cm
                    </div>
                  </div>
                </>
              )}

              {selectedMetric === "benchmarks" && (
                <>
                  <div className="card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Bench Press</span>
                      {calculateProgress(
                        chartData.map((d: any) => d.benchPress),
                      ).trend === "up" ? (
                        <TrendingUp className="text-green-500" />
                      ) : (
                        <TrendingDown className="text-red-500" />
                      )}
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {(chartData[chartData.length - 1] as any)?.benchPress ||
                        0}{" "}
                      kg
                    </div>
                    <div className="text-sm text-gray-400">
                      {calculateProgress(
                        chartData.map((d: any) => d.benchPress),
                      ).change.toFixed(1)}{" "}
                      kg
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Squat</span>
                      {calculateProgress(chartData.map((d: any) => d.squat))
                        .trend === "up" ? (
                        <TrendingUp className="text-green-500" />
                      ) : (
                        <TrendingDown className="text-red-500" />
                      )}
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {(chartData[chartData.length - 1] as any)?.squat || 0} kg
                    </div>
                    <div className="text-sm text-gray-400">
                      {calculateProgress(
                        chartData.map((d: any) => d.squat),
                      ).change.toFixed(1)}{" "}
                      kg
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Deadlift</span>
                      {calculateProgress(chartData.map((d: any) => d.deadlift))
                        .trend === "up" ? (
                        <TrendingUp className="text-green-500" />
                      ) : (
                        <TrendingDown className="text-red-500" />
                      )}
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {(chartData[chartData.length - 1] as any)?.deadlift || 0}{" "}
                      kg
                    </div>
                    <div className="text-sm text-gray-400">
                      {calculateProgress(
                        chartData.map((d: any) => d.deadlift),
                      ).change.toFixed(1)}{" "}
                      kg
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Chart */}
          {chartData.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold text-white mb-6">
                {getClientName(selectedClient)} - Progress Over Time
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="date" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #333",
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend />

                  {selectedMetric === "weight" && (
                    <>
                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#FFFF00"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="bodyFat"
                        stroke="#ff6b6b"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="muscleMass"
                        stroke="#4ecdc4"
                        strokeWidth={2}
                      />
                    </>
                  )}

                  {selectedMetric === "measurements" && (
                    <>
                      <Line
                        type="monotone"
                        dataKey="waist"
                        stroke="#FFFF00"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="hips"
                        stroke="#ff6b6b"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="chest"
                        stroke="#4ecdc4"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="thigh"
                        stroke="#95e77e"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="arm"
                        stroke="#a8e6cf"
                        strokeWidth={2}
                      />
                    </>
                  )}

                  {selectedMetric === "benchmarks" && (
                    <>
                      <Line
                        type="monotone"
                        dataKey="benchPress"
                        stroke="#FFFF00"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="squat"
                        stroke="#ff6b6b"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="deadlift"
                        stroke="#4ecdc4"
                        strokeWidth={2}
                      />
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Session History */}
          {clientSessions.length > 0 && (
            <div className="card mt-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                Session History
              </h2>
              <div className="space-y-3">
                {clientSessions.map((session, index) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 border border-dark-border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-neon-yellow rounded-full flex items-center justify-center text-black font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          Session {index + 1}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {new Date(session.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white">
                        {session.bodyComposition?.weight || 0} kg
                      </div>
                      <div className="text-gray-400 text-sm">
                        {session.bodyComposition?.bodyFat || 0}% BF
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {chartData.length === 0 && (
            <div className="text-center py-16">
              <Activity size={64} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg">
                No assessment data for this client
              </p>
              <p className="text-gray-500 mt-2">
                Complete assessment sessions to see progress charts
              </p>
            </div>
          )}
        </>
      )}
    </TabletLayout>
  );
};

export default Analytics;
