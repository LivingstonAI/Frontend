import React from 'react';

const MarketShareInfographic = () => {
  const companies = [
    {
      name: "Samsung",
      logo: "🏢",
      color: "from-blue-600 to-blue-800",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      industries: [
        {
          name: "Semiconductors",
          share: "12%",
          note: "Q3 2024 (2nd largest globally)",
          icon: "🔌"
        },
        {
          name: "Smartphones",
          share: "20%",
          note: "Global market leader",
          icon: "📱"
        },
        {
          name: "Memory Market",
          share: "42.2%",
          note: "2023 global semiconductor memory",
          icon: "💾"
        }
      ]
    },
    {
      name: "Hyundai",
      logo: "🚗",
      color: "from-gray-600 to-gray-800",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      industries: [
        {
          name: "Global Automotive",
          share: "5.8%",
          note: "3rd largest automaker worldwide",
          icon: "🌍"
        },
        {
          name: "Electric Vehicles",
          share: "3.1%",
          note: "Growing EV market presence",
          icon: "⚡"
        },
        {
          name: "Heavy Industries",
          share: "15%",
          note: "Construction equipment market",
          icon: "🏗️"
        }
      ]
    },
    {
      name: "LG",
      logo: "📺",
      color: "from-red-600 to-red-800",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      industries: [
        {
          name: "OLED Displays",
          share: "49.9%",
          note: "Korean OLED market (with Samsung)",
          icon: "🖥️"
        },
        {
          name: "Automotive OLED",
          share: "90%+",
          note: "Market leader in automotive AMOLEDs",
          icon: "🚙"
        },
        {
          name: "Home Appliances",
          share: "13%",
          note: "Global major appliances market",
          icon: "🏠"
        }
      ]
    }
  ];

  const CircularProgress = ({ percentage, color, size = 120 }) => {
    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = `${(parseFloat(percentage) / 100) * circumference} ${circumference}`;
    
    return (
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            className={`transition-all duration-1000 ease-out ${color}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-800">{percentage}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Korean Tech Giants
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Market share dominance across key technology sectors - Samsung, Hyundai & LG leading global innovation
          </p>
          <div className="mt-6 flex justify-center items-center space-x-2 text-sm text-gray-500">
            <span>📊</span>
            <span>Data as of 2024</span>
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {companies.map((company, index) => (
            <div
              key={company.name}
              className={`${company.bgColor} ${company.borderColor} border-2 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
            >
              {/* Company Header */}
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">{company.logo}</div>
                <h2 className={`text-3xl font-bold bg-gradient-to-r ${company.color} bg-clip-text text-transparent`}>
                  {company.name}
                </h2>
              </div>

              {/* Industries */}
              <div className="space-y-6">
                {company.industries.map((industry, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{industry.icon}</span>
                        <h3 className="font-semibold text-gray-800">{industry.name}</h3>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <CircularProgress 
                        percentage={industry.share} 
                        color={`text-${company.color.split('-')[1]}-500`}
                        size={80}
                      />
                      <div className="flex-1 ml-4">
                        <div className={`text-2xl font-bold bg-gradient-to-r ${company.color} bg-clip-text text-transparent`}>
                          {industry.share}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{industry.note}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Key Insights */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Key Market Insights</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="font-bold text-blue-800 mb-2">Samsung Leadership</h3>
              <p className="text-sm text-gray-600">Dominates smartphone market with 20% share and leads memory semiconductors</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="font-bold text-gray-800 mb-2">Hyundai Growth</h3>
              <p className="text-sm text-gray-600">3rd largest automaker globally, expanding rapidly in EV market</p>
            </div>
            <div className="text-center p-6 bg-red-50 rounded-xl">
              <div className="text-4xl mb-3">🔥</div>
              <h3 className="font-bold text-red-800 mb-2">LG Innovation</h3>
              <p className="text-sm text-gray-600">OLED technology leader with 90%+ automotive AMOLED market share</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p className="text-sm">Sources: Counterpoint Research, Omdia, Statista | Market data reflects latest available figures for 2024</p>
        </div>
      </div>
    </div>
  );
};

export default MarketShareInfographic;