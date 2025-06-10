import React from 'react';

const MarketShareInfographic = () => {
  const companies = [
    {
      name: "Samsung",
      logo: "🏢",
      colorGradient: "linear-gradient(to right, #2563EB, #1E40AF)", // blue-600 to blue-800
      primaryColor: "#3B82F6", // blue-500 for circular progress
      bgColor: "#EFF6FF", // blue-50
      borderColor: "#BFDBFE", // blue-200
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
      colorGradient: "linear-gradient(to right, #4B5563, #374151)", // gray-600 to gray-800
      primaryColor: "#6B7280", // gray-500
      bgColor: "#F9FAFB", // gray-50
      borderColor: "#E5E7EB", // gray-200
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
      colorGradient: "linear-gradient(to right, #DC2626, #991B1B)", // red-600 to red-800
      primaryColor: "#EF4444", // red-500
      bgColor: "#FEF2F2", // red-50
      borderColor: "#FEE2E2", // red-200
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

  // Define styles as a constant object
  const styles = {
    // Main container
    mainContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #F8FAFC, #E2E8F0)', // bg-gradient-to-br from-slate-100 to-slate-200
      padding: '1rem', // p-4
      fontFamily: 'Inter, sans-serif', // Using Inter font
    },
    // Max width wrapper
    maxWidthWrapper: {
      maxWidth: '80rem', // max-w-7xl
      margin: '0 auto', // mx-auto
    },
    // Header section
    headerContainer: {
      textAlign: 'center',
      marginBottom: '3rem', // mb-12
    },
    headerTitle: {
      fontSize: '2.5rem', // text-4xl (responsive for sm:text-5xl would need JS or external CSS)
      fontWeight: '800', // font-extrabold
      color: '#1F2937', // text-gray-900
      marginBottom: '1rem', // mb-4
      letterSpacing: '-0.025em', // tracking-tight
    },
    headerGradientText: {
      background: 'linear-gradient(to right, #8B5CF6, #6366F1)', // from-purple-600 to-indigo-600
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      MozBackgroundClip: 'text', // For Firefox
      MozTextFillColor: 'transparent', // For Firefox
    },
    headerSubtitle: {
      fontSize: '1.125rem', // text-lg (responsive for sm:text-xl would need JS or external CSS)
      color: '#374151', // text-gray-700
      maxWidth: '48rem', // max-w-3xl
      margin: '0 auto',
      lineHeight: '1.625', // leading-relaxed
    },
    headerInfo: {
      marginTop: '1.5rem', // mt-6
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '0.5rem', // space-x-2
      fontSize: '0.875rem', // text-sm
      color: '#6B7280', // text-gray-500
    },

    // Companies Grid
    companiesGrid: {
      display: 'grid',
      // For responsiveness (md:grid-cols-2 lg:grid-cols-3), this would require media queries
      // or dynamic style application based on screen width.
      gridTemplateColumns: '1fr', // Default for small screens
      gap: '1.5rem', // gap-6
      marginBottom: '3rem', // mb-12
      // Media queries not directly supported by inline styles.
      // You would typically use a responsive library or JavaScript to manage this.
    },
    // Company Card Base Style (properties that are common to all cards)
    companyCardBase: {
      borderWidth: '2px',
      borderRadius: '1.5rem', // rounded-3xl
      padding: '2rem', // p-6 sm:p-8
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // shadow-xl
      transition: 'all 0.3s ease-in-out', // transition-all duration-300
      display: 'flex',
      flexDirection: 'column',
      // Hover effect would require onMouseEnter/onMouseLeave in component
      // transform: 'translateY(0px)', // For hover effect
    },
    // Company Header within card
    companyHeader: {
      textAlign: 'center',
      marginBottom: '2rem', // mb-8
      paddingBottom: '1rem', // pb-4
      borderBottom: '1px dashed #D1D5DB', // border-b border-dashed border-gray-300
    },
    companyLogo: {
      fontSize: '4rem', // text-6xl
      marginBottom: '1rem', // mb-4
      // Animation would be handled by a separate CSS class or keyframes
    },
    companyNameText: {
      fontSize: '2.25rem', // text-3xl (responsive for sm:text-4xl)
      fontWeight: '700', // font-bold
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      MozBackgroundClip: 'text', // For Firefox
      MozTextFillColor: 'transparent', // For Firefox
    },

    // Industries Section
    industriesSection: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem', // space-y-6
    },
    industryCard: {
      backgroundColor: '#FFFFFF', // bg-white
      borderRadius: '1rem', // rounded-2xl
      padding: '1.25rem', // p-5
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', // shadow-md
      border: '1px solid #F3F4F6', // border border-gray-100
    },
    industryHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '0.75rem', // mb-3
    },
    industryIconName: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem', // space-x-3
    },
    industryIcon: {
      fontSize: '1.5rem', // text-2xl
      color: '#4B5563', // text-gray-700
    },
    industryName: {
      fontWeight: '600', // font-semibold
      fontSize: '1.125rem', // text-lg
      color: '#1F2937', // text-gray-800
    },
    industryShareSection: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    industryShareValue: {
      fontSize: '1.875rem', // text-3xl
      fontWeight: '800', // font-extrabold
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      MozBackgroundClip: 'text', // For Firefox
      MozTextFillColor: 'transparent', // For Firefox
    },
    industryNote: {
      fontSize: '0.875rem', // text-sm
      color: '#4B5563', // text-gray-600
      marginTop: '0.25rem', // mt-1
      fontStyle: 'italic',
    },

    // Key Insights Section
    insightsContainer: {
      backgroundColor: '#FFFFFF', // bg-white
      borderRadius: '1.5rem', // rounded-3xl
      padding: '2rem', // p-6 sm:p-8
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // shadow-xl
      border: '1px solid #F3F4F6', // border border-gray-100
    },
    insightsTitle: {
      fontSize: '1.875rem', // text-3xl
      fontWeight: '700', // font-bold
      textAlign: 'center',
      color: '#1F2937', // text-gray-900
      marginBottom: '2rem', // mb-8
    },
    insightsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr', // Default for small screens
      gap: '1.5rem', // gap-6
      // Media queries not directly supported by inline styles.
      // You would typically use a responsive library or JavaScript to manage this.
    },
    insightCardBase: { // This now serves as a true base for common properties
      textAlign: 'center',
      padding: '1.5rem', // p-6
      borderRadius: '1rem', // rounded-2xl
      borderWidth: '1px',
      transition: 'transform 0.2s ease-in-out', // For potential hover effect
      // Hover effect would require onMouseEnter/onMouseLeave
    },
    insightIcon: {
      fontSize: '2.25rem', // text-4xl
      marginBottom: '0.75rem', // mb-3
    },
    insightTitle: {
      fontWeight: '700', // font-bold
      fontSize: '1.25rem', // text-xl
      marginBottom: '0.5rem', // mb-2
    },
    insightDescription: {
      fontSize: '0.875rem', // text-sm
      color: '#374151', // text-gray-700
      lineHeight: '1.5', // leading-relaxed
    },

    // Footer
    footer: {
      textAlign: 'center',
      marginTop: '3rem', // mt-12
      color: '#6B7280', // text-gray-500
      fontSize: '0.75rem', // text-xs (sm:text-sm)
    }
  };

  const CircularProgress = ({ percentage, color, size = 120 }) => {
    const radius = (size - 20) / 2; // size-20 for stroke-width 8 on each side
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = `${(parseFloat(percentage) / 100) * circumference} ${circumference}`;
    
    // Inline styles for the SVG component
    const svgStyles = {
        container: {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        svgElement: {
            transform: 'rotate(-90deg)', // transform -rotate-90
        },
        circleBackground: {
            stroke: '#E5E7EB', // text-gray-200
            strokeWidth: '8',
            fill: 'transparent',
        },
        circleProgress: {
            stroke: color, // Dynamic color passed
            strokeWidth: '8',
            fill: 'transparent',
            strokeDasharray: strokeDasharray,
            strokeLinecap: 'round',
            transition: 'all 1s ease-out', // transition-all duration-1000 ease-out
        },
        textOverlay: {
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        percentageText: {
            fontSize: '1.5rem', // text-2xl
            fontWeight: '700', // font-bold
            color: '#1F2937', // text-gray-800
        }
    };

    return (
      <div style={svgStyles.container}>
        <svg width={size} height={size} style={svgStyles.svgElement}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            style={svgStyles.circleBackground}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            style={svgStyles.circleProgress}
          />
        </svg>
        <div style={svgStyles.textOverlay}>
          <span style={svgStyles.percentageText}>{percentage}</span>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.mainContainer}>
      <div style={styles.maxWidthWrapper}>
        {/* Header */}
        <div style={styles.headerContainer}>
          <h1 style={styles.headerTitle}>
            Korean Tech Giants: <span style={styles.headerGradientText}>Market Dominance</span>
          </h1>
          <p style={styles.headerSubtitle}>
            Unveiling the market share of leading Korean technology companies – Samsung, Hyundai, and LG – as they drive global innovation across diverse sectors.
          </p>
          <div style={styles.headerInfo}>
            <span>📊</span>
            <span>Data as of Q4 2024 (Latest available figures)</span>
          </div>
        </div>

        {/* Companies Grid */}
        <div style={styles.companiesGrid}>
          {companies.map((company) => (
            <div
              key={company.name}
              style={{
                ...styles.companyCardBase,
                backgroundColor: company.bgColor,
                borderColor: company.borderColor,
                // Add onMouseEnter/onMouseLeave for hover effects if needed
                // E.g., onMouseEnter: (e) => e.currentTarget.style.transform = 'translateY(-8px)',
                // onMouseLeave: (e) => e.currentTarget.style.transform = 'translateY(0px)',
              }}
            >
              {/* Company Header */}
              <div style={styles.companyHeader}>
                <div style={styles.companyLogo}>{company.logo}</div>
                <h2
                  style={{
                    ...styles.companyNameText,
                    backgroundImage: company.colorGradient,
                  }}
                >
                  {company.name}
                </h2>
              </div>

              {/* Industries */}
              <div style={styles.industriesSection}>
                {company.industries.map((industry, idx) => (
                  <div key={idx} style={styles.industryCard}>
                    <div style={styles.industryHeader}>
                      <div style={styles.industryIconName}>
                        <span style={styles.industryIcon}>{industry.icon}</span>
                        <h3 style={styles.industryName}>{industry.name}</h3>
                      </div>
                    </div>
                    
                    <div style={styles.industryShareSection}>
                      <CircularProgress
                        percentage={industry.share}
                        color={company.primaryColor} // Pass primary color for the progress circle
                        size={80}
                      />
                      <div style={{ flex: 1, marginLeft: '1rem' }}>
                        <div
                          style={{
                            ...styles.industryShareValue,
                            backgroundImage: company.colorGradient,
                          }}
                        >
                          {industry.share}
                        </div>
                        <p style={styles.industryNote}>{industry.note}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Key Insights */}
        <div style={styles.insightsContainer}>
          <h2 style={styles.insightsTitle}>Key Market Insights</h2>
          <div style={styles.insightsGrid}>
            {/* Samsung Insight Card */}
            <div
              style={{
                ...styles.insightCardBase,
                backgroundColor: '#EFF6FF', // Corresponding to Samsung's blue-50
                borderColor: '#BFDBFE', // Corresponding to Samsung's blue-100
              }}
            >
              <div style={styles.insightIcon}>🏆</div>
              <h3 style={{ ...styles.insightTitle, color: '#1E40AF' }}>Samsung's Unrivaled Leadership</h3>
              <p style={styles.insightDescription}>
                Samsung continues to dominate the global smartphone market with a **20% share** and stands as a key leader in memory semiconductors.
              </p>
            </div>
            {/* Hyundai Insight Card */}
            <div
              style={{
                ...styles.insightCardBase,
                backgroundColor: '#F9FAFB', // Corresponding to Hyundai's gray-50
                borderColor: '#E5E7EB', // Corresponding to Hyundai's gray-100
              }}
            >
              <div style={styles.insightIcon}>🚀</div>
              <h3 style={{ ...styles.insightTitle, color: '#374151' }}>Hyundai's Automotive Ascension</h3>
              <p style={styles.insightDescription}>
                As the **3rd largest automaker worldwide**, Hyundai shows significant growth, especially within the burgeoning EV market.
              </p>
            </div>
            {/* LG Insight Card */}
            <div
              style={{
                ...styles.insightCardBase,
                backgroundColor: '#FEF2F2', // Corresponding to LG's red-50
                borderColor: '#FEE2E2', // Corresponding to LG's red-100
              }}
            >
              <div style={styles.insightIcon}>🔥</div>
              <h3 style={{ ...styles.insightTitle, color: '#991B1B' }}>LG's Display and Appliance Prowess</h3>
              <p style={styles.insightDescription}>
                LG remains an **OLED technology pioneer**, boasting over 90% market share in automotive AMOLEDs and a strong presence in home appliances.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={{ lineHeight: '1.5' }}>
            Sources: Counterpoint Research, Omdia, Statista, and various industry reports.
            <br />
            *All market data reflects the latest available figures as of Q4 2024 and is subject to change. Percentages are approximate.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketShareInfographic;