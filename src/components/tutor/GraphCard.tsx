import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface GraphCardProps {
  equation: string; // e.g., "y=2x+1"
  title?: string;
}

export const GraphCard: React.FC<GraphCardProps> = ({ equation, title }) => {
  // Simple parser for y = mx + c
  // Supports forms: "y=2x+1", "y=-x", "y=x-5", "y=3"
  const parseEquation = (eq: string) => {
    const cleanEq = eq.replace(/\s/g, "").toLowerCase();
    let m = 0;
    let c = 0;

    if (cleanEq.startsWith("y=")) {
      const rhs = cleanEq.split("y=")[1];
      
      if (rhs.includes("x")) {
        const parts = rhs.split("x");
        const mPart = parts[0];
        const cPart = parts[1];

        if (mPart === "" || mPart === "+") m = 1;
        else if (mPart === "-") m = -1;
        else m = parseFloat(mPart);

        if (cPart) {
          c = parseFloat(cPart);
        }
      } else {
        // y = 5 (horizontal line)
        c = parseFloat(rhs);
      }
    }
    return { m, c };
  };

  const { m, c } = parseEquation(equation);

  const generateData = () => {
    const data = [];
    for (let x = -10; x <= 10; x++) {
      data.push({
        x,
        y: m * x + c,
      });
    }
    return data;
  };

  const data = generateData();

  return (
    <div className="w-full h-64 bg-white rounded-xl border border-gray-200 p-4 my-4 shadow-sm">
      <div className="text-center mb-2">
        <h3 className="text-sm font-semibold text-gray-700">{title || equation}</h3>
        <p className="text-xs text-gray-400 font-mono">Graph of {equation}</p>
      </div>
      <div className="w-full h-full pb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="x"
              type="number"
              domain={[-10, 10]}
              allowDataOverflow
              stroke="#9ca3af"
              fontSize={12}
            />
            <YAxis
              type="number"
              domain={["auto", "auto"]}
              stroke="#9ca3af"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <ReferenceLine y={0} stroke="#e5e7eb" strokeWidth={2} />
            <ReferenceLine x={0} stroke="#e5e7eb" strokeWidth={2} />
            <Line
              type="monotone"
              dataKey="y"
              stroke="#8b5cf6" // Primary purple
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
