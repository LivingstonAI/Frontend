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

  // New data for Digital Infrastructure comparison
  const digitalInfrastructureData = [
    {
      metric: "Internet Users",
      southKorea: "97.4 % (50.4M)",
      southAfrica: "74.7 % (45.34M)",
      icon: "🧑‍💻"
    },
    {
      metric: "Internet Speed",
      southKorea: "World-leading",
      southAfrica: "Developing",
      icon: "⚡"
    },
    {
      metric: "5G Coverage",
      southKorea: "Comprehensive",
      southAfrica: "Limited",
      icon: "📶"
    }
  ];

  // New data for Major Tech Company Usage comparison
  const majorTechUsageData = [
    {
      category: "Search Engines",
      southKorea: "Naver - 60% market share\nGoogle (35%)",
      southAfrica: "Google - 95%+ dominant\nBing/Yahoo (minor)",
    },
    {
      category: "Smartphones",
      southKorea: "Samsung - strong local loyalty\nLG (historically strong)",
      southAfrica: "Samsung, Huawei, Xiaomi\nApple (upper segment)",
    },
    {
      category: "Messaging Apps",
      southKorea: "KakaoTalk - 90%+ user base\nLine (minor)",
      southAfrica: "WhatsApp - near-universal\nTelegram, Signal (small %s)",
    },
    {
      category: "E-commerce",
      southKorea: "Coupang - dominant delivery app\nGmarket, 11st",
      southAfrica: "Takealot - largest local player\nMakro, Loot, Jumia",
    },
    {
      category: "Streaming",
      southKorea: "TVING, Wavve, Netflix\nHigh demand for local content",
      southAfrica: "Netflix, Showmax, YouTube\nMix of global + local",
    },
    {
      category: "Digital Payment",
      southKorea: "Naver Pay, Kakao Pay, Toss",
      southAfrica: "SnapScan, Zapper, EFT, credit cards",
    },
  ];

  // Define styles as a constant object using a function to allow for dynamic responsive styles
  // For proper responsiveness without external CSS or libraries, we use dynamic inline styles
  // based on window width.
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getResponsiveStyles = () => {
    const isSmallScreen = windowWidth < 768; // Tailwind's 'md' breakpoint is 768px

    return {
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
        fontSize: isSmallScreen ? '2rem' : '2.5rem', // text-4xl (responsive for sm:text-5xl)
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
        fontSize: isSmallScreen ? '1rem' : '1.125rem', // text-lg (responsive for sm:text-xl)
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

      // Companies Grid - Modified to always be a single column
      companiesGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr', // Always one column
        gap: '1.5rem', // gap-6
        marginBottom: '3rem', // mb-12
      },
      // Company Card Base Style (properties that are common to all cards)
      companyCardBase: {
        borderWidth: '2px',
        borderRadius: '1.5rem', // rounded-3xl
        padding: isSmallScreen ? '1.5rem' : '2rem', // p-6 sm:p-8
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
        fontSize: isSmallScreen ? '2rem' : '2.25rem', // text-3xl (responsive for sm:text-4xl)
        fontWeight: '700', // font-bold
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        MozBackgroundClip: 'text', // For Firefox
        MozTextFillColor: 'transparent', // For Firefox
      },

      // Industries Section - Modified for horizontal layout
      industriesSection: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: isSmallScreen ? 'column' : 'row', // Column on small, row on larger
        flexWrap: 'wrap', // Allow wrapping on small screens
        gap: '1.5rem', // space-y-6
        justifyContent: 'space-around', // Distribute items horizontally
        alignItems: 'stretch', // Make sure cards have equal height if needed
      },
      industryCard: {
        backgroundColor: '#FFFFFF', // bg-white
        borderRadius: '1rem', // rounded-2xl
        padding: '1.25rem', // p-5
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', // shadow-md
        border: '1px solid #F3F4F6', // border border-gray-100
        flex: isSmallScreen ? 'none' : '1', // No flex on small screens, flex:1 on larger
        minWidth: isSmallScreen ? 'auto' : 'calc(33% - 1rem)', // Approx 3 items per row on larger screens
        maxWidth: isSmallScreen ? '100%' : 'calc(33% - 1rem)', // Max width to control wrapping
        display: 'flex', // Ensure content within card is flexible
        flexDirection: 'column', // Stack content within each industry card vertically
        justifyContent: 'space-between',
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
        marginTop: 'auto', // Push to bottom if card grows
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

      // Table-based styles for both digital infra and major tech usage
      tableContainer: {
        backgroundColor: '#FFFFFF', // bg-white
        borderRadius: '1.5rem', // rounded-3xl
        padding: isSmallScreen ? '1.5rem' : '2rem', // p-6 sm:p-8
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // shadow-xl
        border: '1px solid #F3F4F6', // border border-gray-100
        marginTop: '3rem', // mt-12
      },
      tableTitle: {
        fontSize: isSmallScreen ? '1.5rem' : '1.875rem', // text-3xl
        fontWeight: '700', // font-bold
        textAlign: 'center',
        color: '#1F2937', // text-gray-900
        marginBottom: '2rem', // mb-8
      },
      table: {
        width: '100%',
        borderCollapse: 'collapse',
        borderRadius: '0.75rem', // rounded-xl
        overflow: 'hidden', // Ensures rounded corners apply to children
        backgroundColor: '#F8FAFC', // slate-50
      },
      tableHead: {
        backgroundColor: '#E2E8F0', // slate-200
        color: '#1F2937', // gray-900
        fontWeight: '700', // font-bold
        fontSize: isSmallScreen ? '0.875rem' : '1rem', // text-sm / text-base
      },
      tableHeadTh: {
        padding: '1rem', // p-4
        textAlign: 'left',
        borderBottom: '2px solid #CBD5E1', // slate-300
      },
      tableCell: {
        padding: '1rem', // p-4
        borderBottom: '1px solid #E2E8F0', // slate-200
        color: '#374151', // gray-700
        fontSize: isSmallScreen ? '0.875rem' : '0.9375rem', // text-sm / text-base-ish
        fontWeight: '500', // font-medium
        whiteSpace: 'pre-wrap', // Preserve new lines in the text
      },
      tableIcon: {
        marginRight: '0.5rem', // mr-2
      },


      // Key Insights Section
      insightsContainer: {
        backgroundColor: '#FFFFFF', // bg-white
        borderRadius: '1.5rem', // rounded-3xl
        padding: isSmallScreen ? '1.5rem' : '2rem', // p-6 sm:p-8
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // shadow-xl
        border: '1px solid #F3F4F6', // border border-gray-100
        marginTop: '3rem', // mt-12
      },
      insightsTitle: {
        fontSize: isSmallScreen ? '1.5rem' : '1.875rem', // text-3xl
        fontWeight: '700', // font-bold
        textAlign: 'center',
        color: '#1F2937', // text-gray-900
        marginBottom: '2rem', // mb-8
      },
      insightsGrid: {
        display: 'grid',
        gridTemplateColumns: isSmallScreen ? '1fr' : 'repeat(3, 1fr)', // Default for small screens, 3 for larger
        gap: '1.5rem', // gap-6
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
  };

  const styles = getResponsiveStyles(); // Get styles dynamically

  const CircularProgress = ({ percentage, color, size = 120 }) => {
    // Convert percentage to a number, remove '%' and trim spaces
    const numericPercentage = parseFloat(percentage.replace('%', '').trim());

    // Ensure numericPercentage is a valid number, default to 0 if not
    const validPercentage = isNaN(numericPercentage) ? 0 : numericPercentage;

    const radius = (size - 20) / 2; // size-20 for stroke-width 8 on each side
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (validPercentage / 100) * circumference;
    
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
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
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

        {/* Digital Infrastructure Comparison Section (Table-based) */}
        <div style={styles.tableContainer}>
          <h2 style={styles.tableTitle}>Digital Infrastructure: South Korea vs. South Africa</h2>
          <table style={styles.table}>
            <thead style={styles.tableHead}>
              <tr>
                <th style={styles.tableHeadTh}>Metric</th>
                <th style={styles.tableHeadTh}>South Korea</th>
                <th style={styles.tableHeadTh}>South Africa</th>
              </tr>
            </thead>
            <tbody>
              {digitalInfrastructureData.map((data, index) => (
                <tr 
                  key={index} 
                  style={{
                    backgroundColor: index % 2 === 0 ? '#F8FAFC' : '#F0F9FF', // Zebra striping: slate-50 for even, blue-50 for odd
                    // You can add hover effect here if needed, e.g., using onMouseEnter/onMouseLeave
                    // onMouseEnter: (e) => e.currentTarget.style.backgroundColor = '#EBF8FF', // blue-100
                    // onMouseLeave: (e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#F8FAFC' : '#F0F9FF',
                  }}
                >
                  <td style={styles.tableCell}>
                    <span style={styles.tableIcon}>{data.icon}</span>
                    {data.metric}
                  </td>
                  <td style={styles.tableCell}>{data.southKorea}</td>
                  <td style={styles.tableCell}>{data.southAfrica}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Major Tech Company Usage Comparison Section (Table-based) */}
        <div style={styles.tableContainer}>
          <h2 style={styles.tableTitle}>Major Tech Company Usage: South Korea vs. South Africa</h2>
          <table style={styles.table}>
            <thead style={styles.tableHead}>
              <tr>
                <th style={styles.tableHeadTh}>Category</th>
                <th style={styles.tableHeadTh}>South Korea KR</th>
                <th style={styles.tableHeadTh}>South Africa ZA</th>
              </tr>
            </thead>
            <tbody>
              {majorTechUsageData.map((data, index) => (
                <tr 
                  key={index} 
                  style={{
                    backgroundColor: index % 2 === 0 ? '#F8FAFC' : '#F0F9FF', // Zebra striping
                  }}
                >
                  <td style={styles.tableCell}>{data.category}</td>
                  <td style={styles.tableCell}>{data.southKorea}</td>
                  <td style={styles.tableCell}>{data.southAfrica}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
            Sources: Counterpoint Research, Omdia, Statista, and various industry reports. Digital Infrastructure data from provided image. Major Tech Company Usage data from provided image.
            <br />
            *All market data reflects the latest available figures as of Q4 2024 and is subject to change. Percentages are approximate.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketShareInfographic;
