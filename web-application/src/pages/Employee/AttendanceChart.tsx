import React, { useState, useMemo } from "react";
import { ChevronDown, Filter, type LucideIcon } from "lucide-react";
import type { AttendanceRecord } from "../../data/types";

// --- Types ---

export type AttendanceStatus = "present" | "absent" | "late" | "half-day";

export interface ApiResponse {
  success: boolean;
  count: number;
  history: AttendanceRecord[];
}

interface ChartDataPoint extends AttendanceRecord {
  formattedDate: string;
  barColor: string;
}

// --- Helper Functions ---

// Formats date string to "DD-Mon" (e.g. "01-Mon")
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate();
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  return `${day}-${weekday}`;
};

// --- Small UI Pieces ---

interface FilterButtonProps {
  label: string;
  icon?: LucideIcon;
  active?: boolean;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  icon: Icon = ChevronDown,
  active = false,
}) => (
  <button
    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${
      active
        ? "bg-indigo-50 text-indigo-600 border-indigo-100"
        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
    }`}
  >
    {label}
    <Icon size={16} />
  </button>
);

interface LegendItemProps {
  color: string;
  label: string;
}

const LegendItem: React.FC<LegendItemProps> = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 rounded-full ${color}`} />
    <span className="text-sm font-medium text-gray-600">{label}</span>
  </div>
);

interface TooltipProps {
  x: number | string;
  y: number;
  data: ChartDataPoint;
}

const Tooltip: React.FC<TooltipProps> = ({ x, y, data }) => (
  <div
    className="absolute z-10 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full transition-opacity duration-200"
    style={{ left: x, top: y - 10 }}
  >
    <div className="font-semibold mb-1">{data.formattedDate}</div>
    <div className="flex items-center gap-2 mb-1">
      <div className="w-2 h-2 rounded-full bg-indigo-500" />
      <span>Status: {data.status}</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-sky-400" />
      <span>Hours: {data.totalHours}h</span>
    </div>
    <div className="absolute left-1/2 bottom-0 w-2 h-2 bg-gray-800 transform -translate-x-1/2 translate-y-1/2 rotate-45" />
  </div>
);

// --- Main Component ---

interface AttendanceChartProps {
  data: ApiResponse; // e.g. API_DATA from sample_data.ts
}

const AttendanceChart: React.FC<AttendanceChartProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Process + sort data (last 12 entries to match inspiration)
  const chartData: ChartDataPoint[] = useMemo(() => {
    if (!data || !data.history || data.history.length === 0) return [];

    return data.history
      .slice() // don’t mutate original
      .sort(
        (a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      )
      .slice(-12) // last 12 days
      .map((item) => ({
        ...item,
        formattedDate: formatDate(item.date),
        barColor:
          item.status === "present"
            ? "bg-indigo-600"
            : item.status === "late"
            ? "bg-sky-400"
            : item.status === "half-day"
            ? "bg-sky-200"
            : "bg-gray-200",
      }));
  }, [data]);

  const maxHours = 10; // Y axis max

  return (
    <div className="flex-1 p-8 pr-0">
      <div className="bg-white p-8 rounded-2xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Attendance Status - This Month
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Daily hours worked overview
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <FilterButton label="All Departments" icon={Filter} />
            <FilterButton label="Month" />
            <FilterButton label="Year" />
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-end gap-6 mb-6">
          <LegendItem color="bg-indigo-600" label="Present (≈8h)" />
          <LegendItem color="bg-sky-400" label="Late / Half-day" />
          <LegendItem color="bg-gray-200" label="Absent" />
        </div>

        {/* Chart area */}
        <div className="relative h-64 w-full">
          {/* Y-axis grid */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[10, 8, 6, 4, 2, 0].map((val) => (
              <div key={val} className="flex items-center w-full">
                <span className="w-8 text-xs text-gray-400 font-medium text-right mr-4">
                  {val}
                </span>
                <div className="flex-1 h-px bg-gray-100 border-t border-dashed border-gray-200" />
              </div>
            ))}
          </div>

          {/* Bars */}
          <div className="absolute inset-0 ml-12 flex justify-between items-end px-4 pt-4 pb-0">
            {chartData.map((item, index) => {
              const heightPercent = Math.min(
                (item.totalHours / maxHours) * 100,
                100
              );

              return (
                <div
                  key={item._id}
                  className="relative flex flex-col items-center group w-full"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div
                    className={`w-3 md:w-4 rounded-t-lg transition-all duration-300 ease-out ${item.barColor} ${
                      hoveredIndex === index
                        ? "opacity-100 shadow-lg scale-105"
                        : "opacity-90"
                    }`}
                    style={{
                      height: `${heightPercent === 0 ? 2 : heightPercent}%`, // ensure visible even for 0h
                    }}
                  />

                  <span className="absolute -bottom-8 text-[10px] md:text-xs font-medium text-gray-500 whitespace-nowrap">
                    {item.formattedDate}
                  </span>

                  {hoveredIndex === index && (
                    <Tooltip x="50%" y={-10} data={item} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Spacer for x-axis labels */}
        <div className="h-8" />
      </div>
    </div>
  );
};

export default AttendanceChart;
