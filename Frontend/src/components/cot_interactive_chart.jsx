import React, { useMemo, useState } from 'react';
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
  const [showStats, setShowStats] = useState(false);

  const formattedData = useMemo(() => {
    if (!chartData || !chartData.dates) return [];
    
    return chartData.dates.map((date, index) => ({
      date: date,
      netNoncommercial: chartData.netNoncommercial[index],
      netCommercial: chartData.netCommercial[index],
      openInterest: chartData.openInterest[index],
    }));
  }, [chartData]);

  const calculatePercentageChange = (values) => {
    if (!values || values.length < 2) return 0;
    const current = values[values.length - 1];
    const previous = values[values.length - 2];
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const percentageChanges = useMemo(() => {
    if (!chartData) return {};
    
    return {
      openInterest: calculatePercentageChange(chartData.openInterest),
      commercial: calculatePercentageChange(chartData.netCommercial),
      noncommercial: calculatePercentageChange(chartData.netNoncommercial)
    };
  }, [chartData]);

  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

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
    <div className="w-full space-y-4">
      {/* Net Positions Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h4 className="text-base font-medium mb-4 text-gray-700">
          Net Positions - {asset}
        </h4>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={50}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <ReferenceLine 
                y={chartData.midpointCommercial} 
                stroke="#10b981" 
                strokeDasharray="8 8"
                label={{
                  value: `Midpoint: ${chartData.midpointCommercial?.toLocaleString()}`,
                  position: "topLeft",
                  fontSize: 10
                }}
              />
              <Line 
                type="monotone" 
                dataKey="netNoncommercial" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Net Noncommercial"
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="netCommercial" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Net Commercial"
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Open Interest Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h4 className="text-base font-medium mb-4 text-gray-700">
          Open Interest - {asset}
        </h4>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={50}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="openInterest" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                name="Open Interest"
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Toggleable Stats Summary */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <button
          onClick={() => setShowStats(!showStats)}
          className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-200 flex items-center justify-between"
        >
          <span className="font-medium text-gray-700">Statistics Summary</span>
          <svg 
            className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${showStats ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {showStats && (
          <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Open Interest</p>
                    <p className={`text-lg font-bold ${percentageChanges.openInterest >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(percentageChanges.openInterest)}
                    </p>
                  </div>
                  <div className={`p-2 rounded-full ${percentageChanges.openInterest >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    <svg className={`w-4 h-4 ${percentageChanges.openInterest >= 0 ? 'text-green-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                      {percentageChanges.openInterest >= 0 ? (
                        <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      )}
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Commercial</p>
                    <p className={`text-lg font-bold ${percentageChanges.commercial >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(percentageChanges.commercial)}
                    </p>
                  </div>
                  <div className={`p-2 rounded-full ${percentageChanges.commercial >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    <svg className={`w-4 h-4 ${percentageChanges.commercial >= 0 ? 'text-green-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                      {percentageChanges.commercial >= 0 ? (
                        <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      )}
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Non-Commercial</p>
                    <p className={`text-lg font-bold ${percentageChanges.noncommercial >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(percentageChanges.noncommercial)}
                    </p>
                  </div>
                  <div className={`p-2 rounded-full ${percentageChanges.noncommercial >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    <svg className={`w-4 h-4 ${percentageChanges.noncommercial >= 0 ? 'text-green-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                      {percentageChanges.noncommercial >= 0 ? (
                        <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      )}
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveCOTChart;