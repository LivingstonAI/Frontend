import React, { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

const InteractiveCOTChart = ({ asset, chartData }) => {
  const formattedData = useMemo(() => {
    if (!chartData || !chartData.dates) return [];
    
    return chartData.dates.map((date, index) => ({
      date: date,
      netNoncommercial: chartData.netNoncommercial[index],
      netCommercial: chartData.netCommercial[index],
      openInterest: chartData.openInterest[index],
    }));
  }, [chartData]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{`Date: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value?.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!chartData || !chartData.dates) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No chart data available</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Net Positions Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Net Positions - {asset}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine 
              y={chartData.midpointCommercial} 
              stroke="#10b981" 
              strokeDasharray="8 8"
              label={{
                value: `Midpoint: ${chartData.midpointCommercial?.toLocaleString()}`,
                position: "topLeft"
              }}
            />
            <Line 
              type="monotone" 
              dataKey="netNoncommercial" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Net Noncommercial Positions"
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="netCommercial" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="Net Commercial Positions"
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Open Interest Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Open Interest - {asset}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="openInterest" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              name="Open Interest"
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Statistics Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white p-2 rounded">
            <p className="text-gray-600">Commercial Range</p>
            <p className="font-semibold">
              {chartData.minCommercial?.toLocaleString()} - {chartData.maxCommercial?.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-2 rounded">
            <p className="text-gray-600">Commercial Midpoint</p>
            <p className="font-semibold text-green-600">
              {chartData.midpointCommercial?.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-2 rounded">
            <p className="text-gray-600">Data Points</p>
            <p className="font-semibold">{chartData.dates?.length || 0}</p>
          </div>
          <div className="bg-white p-2 rounded">
            <p className="text-gray-600">Latest OI</p>
            <p className="font-semibold">
              {chartData.openInterest?.[chartData.openInterest.length - 1]?.toLocaleString() || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveCOTChart;