import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
import snowai_logo from '../snowai.jpg';
import tlotlo_motingwe from '../IMG_20250905_152436.jpg';


export default function GoogleCalendar() {
    const baseUrl = 'https://backend-production-c0ab.up.railway.app';
    const [accountData, setAccountData] = useState(null);
    const [trades, setTrades] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTrades, setSelectedTrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [downloadingPDF, setDownloadingPDF] = useState(false);
    const accountName = Cookies.get('account_name');

    // Add these state variables at the top with your other useState hooks
    const [selectedChart, setSelectedChart] = useState(null);
    const [chartMetrics, setChartMetrics] = useState({});

    useEffect(() => {
        fetchTrades();
    }, []);

    const fetchTrades = async () => {
        try {
            setLoading(true);
            setError(null);
            
            if (!accountName) {
                throw new Error('Account name not found. Please log in again.');
            }

            const response = await fetch(`${baseUrl}/api/trades-calendar/?account_name=${accountName}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('No trading data found for this account.');
                } else if (response.status === 401) {
                    throw new Error('Unauthorized access. Please log in again.');
                } else if (response.status >= 500) {
                    throw new Error('Server error. Please try again later.');
                } else {
                    throw new Error(`Failed to fetch trades: ${response.status}`);
                }
            }

            const data = await response.json();
            
            if (!Array.isArray(data)) {
                throw new Error('Invalid data format received from server.');
            }
            
            // Normalize amounts based on outcome and adjust dates
            const normalizedTrades = data.map(trade => ({
                ...trade,
                amount: trade.outcome === 'Loss' ? -Math.abs(trade.amount) : Math.abs(trade.amount),
                // Shift the date back by 2 days before processing
                date_entered: trade.date_entered ? (() => {
                    const originalDate = new Date(trade.date_entered);
                    originalDate.setDate(originalDate.getDate() - 1);
                    return originalDate.toISOString();
                })() : null
            }));
            
            setTrades(normalizedTrades);
        } catch (error) {
            console.error('Error fetching trades:', error);
            setError(error.message || 'An unexpected error occurred while loading your trades.');
        } finally {
            setLoading(false);
        }
    };
   // Add this function to load external scripts
const loadScript = (src) => {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

// Updated PDF Download Function with CDN loading
const downloadMonthlyReport = async () => {
    setDownloadingPDF(true);
    
    try {
        // Load required libraries from CDN
        await Promise.all([
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'),
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')
        ]);
        
        // Access libraries from window object
        const { jsPDF } = window.jspdf;
        const html2canvas = window.html2canvas;
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        let yPosition = margin;
        
        // Helper function to check if new page is needed
        const checkNewPage = (requiredSpace = 30) => {
            if (yPosition + requiredSpace > pageHeight - margin) {
                pdf.addPage();
                yPosition = margin;
                return true;
            }
            return false;
        };
        
        // Helper function to add section header
        const addSectionHeader = (title, size = 14) => {
            checkNewPage(20);
            pdf.setFontSize(size);
            pdf.setTextColor(0, 124, 186);
            pdf.text(title, margin, yPosition);
            yPosition += size === 14 ? 12 : 8;
        };
        
        // CREATE COVER PAGE WITH LARGE SNOWAI LOGO AND PERSONAL INFO
        try {
            // Add SnowAI Company Report title at the top
            pdf.setFontSize(24);
            pdf.setTextColor(0, 124, 186);
            const companyTitle = 'SnowAI Company Report';
            const companyTitleWidth = pdf.getTextWidth(companyTitle);
            pdf.text(companyTitle, (pageWidth - companyTitleWidth) / 2, yPosition + 15);
            yPosition += 30;
            
            // Load and add SnowAI logo - taking most of remaining page
            const logoCanvas = document.createElement('canvas');
            const logoCtx = logoCanvas.getContext('2d');
            const logoImg = new Image();
            
            // Set up promise to handle logo loading
            const logoPromise = new Promise((resolve) => {
                logoImg.onload = () => {
                    logoCanvas.width = logoImg.width;
                    logoCanvas.height = logoImg.height;
                    logoCtx.drawImage(logoImg, 0, 0);
                    resolve(logoCanvas.toDataURL('image/png'));
                };
                logoImg.onerror = () => {
                    console.warn('SnowAI logo could not be loaded');
                    resolve(null);
                };
                logoImg.src = snowai_logo;
            });
            
            // Load personal photo
            const personalPhotoCanvas = document.createElement('canvas');
            const personalPhotoCtx = personalPhotoCanvas.getContext('2d');
            const personalPhotoImg = new Image();
            
            const personalPhotoPromise = new Promise((resolve) => {
                personalPhotoImg.onload = () => {
                    personalPhotoCanvas.width = personalPhotoImg.width;
                    personalPhotoCanvas.height = personalPhotoImg.height;
                    personalPhotoCtx.drawImage(personalPhotoImg, 0, 0);
                    resolve(personalPhotoCanvas.toDataURL('image/png'));
                };
                personalPhotoImg.onerror = () => {
                    console.warn('Personal photo could not be loaded');
                    resolve(null);
                };
                personalPhotoImg.src = tlotlo_motingwe;
            });
            
            const [logoDataUrl, personalPhotoDataUrl] = await Promise.all([logoPromise, personalPhotoPromise]);
            
            // Add large SnowAI logo - most of page
            if (logoDataUrl) {
                const logoWidth = pageWidth - (margin * 2); // Full width minus margins
                const logoHeight = (pageHeight * 0.45); // 45% of page height
                const logoX = margin;
                const logoY = yPosition + 10;
                
                pdf.addImage(logoDataUrl, 'PNG', logoX, logoY, logoWidth, logoHeight);
                yPosition = logoY + logoHeight + 20; // Move position after logo
            } else {
                // If logo fails to load, add text placeholder
                pdf.setFontSize(48);
                pdf.setTextColor(0, 124, 186);
                const logoText = 'SnowAI';
                const logoTextWidth = pdf.getTextWidth(logoText);
                pdf.text(logoText, (pageWidth - logoTextWidth) / 2, yPosition + 80);
                yPosition += 120;
            }
            
            // Add personal photo and info section
            const personalInfoY = yPosition;
            
            if (personalPhotoDataUrl) {
                // Add small personal photo on the left
                const photoSize = 25;
                const photoX = margin;
                const photoY = personalInfoY;
                
                pdf.addImage(personalPhotoDataUrl, 'JPEG', photoX, photoY, photoSize, photoSize);
                
                // Add name next to the photo
                pdf.setFontSize(16);
                pdf.setTextColor(0, 124, 186);
                const traderName = 'Tlotlo Kutlwano Motingwe';
                pdf.text(traderName, photoX + photoSize + 10, photoY + 8);
                
                // Add multiple title/role lines below name
                pdf.setFontSize(12);
                pdf.setTextColor(100, 100, 100);
                pdf.text('Professional Trader', photoX + photoSize + 10, photoY + 16);
                pdf.text('Quantitative Researcher/Investor', photoX + photoSize + 10, photoY + 24);
                
                // Add contact info below roles
                pdf.setFontSize(9);
                pdf.setTextColor(80, 80, 80);
                pdf.text('+27 84 731 6417', photoX + photoSize + 10, photoY + 32);
                pdf.text('butterrobot83@gmail.com', photoX + photoSize + 10, photoY + 38);
                
                yPosition = photoY + 50;
                
            } else {
                // If personal photo fails, just add name and info
                pdf.setFontSize(16);
                pdf.setTextColor(0, 124, 186);
                const traderName = 'Tlotlo Kutlwano Motingwe';
                pdf.text(traderName, margin, personalInfoY);
                
                // Add multiple description lines
                pdf.setFontSize(12);
                pdf.setTextColor(100, 100, 100);
                pdf.text('Professional Trader', margin, personalInfoY + 10);
                pdf.text('Quantitative Researcher/Investor', margin, personalInfoY + 18);
                
                // Add contact info
                pdf.setFontSize(9);
                pdf.setTextColor(80, 80, 80);
                pdf.text('+27 84 731 6417', margin, personalInfoY + 28);
                pdf.text('butterrobot83@gmail.com', margin, personalInfoY + 36);
                
                yPosition = personalInfoY + 50;
            }
            
            // Add more space before report title to avoid overlap
            yPosition += 20;
            
            // Add report title 
            pdf.setFontSize(22);
            pdf.setTextColor(0, 124, 186);
            const title = `Comprehensive Trading Report`;
            const subtitle = `${getMonthName(currentDate)}`;
            
            const titleWidth = pdf.getTextWidth(title);
            pdf.text(title, (pageWidth - titleWidth) / 2, yPosition);
            
            // Add subtitle (month/year)
            pdf.setFontSize(16);
            pdf.setTextColor(0, 124, 186);
            const subtitleWidth = pdf.getTextWidth(subtitle);
            pdf.text(subtitle, (pageWidth - subtitleWidth) / 2, yPosition + 12);
            
            // Add more space before account info
            yPosition += 35;
            
            // Add account info and generation date at bottom
            pdf.setFontSize(11);
            pdf.setTextColor(0, 0, 0);
            pdf.text(`Account: ${accountName || 'N/A'}`, margin, yPosition);
            pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition + 10);
            
            // Add page number
            pdf.setFontSize(9);
            pdf.text('Page 1', pageWidth - margin - 20, pageHeight - 10);
            
        } catch (logoError) {
            console.warn('Error adding cover page elements:', logoError);
            // Continue with basic cover page if there's an error
            pdf.setFontSize(24);
            pdf.setTextColor(0, 124, 186);
            const companyTitle = 'SnowAI Company Report';
            const companyTitleWidth = pdf.getTextWidth(companyTitle);
            pdf.text(companyTitle, (pageWidth - companyTitleWidth) / 2, 40);
            
            pdf.setFontSize(22);
            const title = `Comprehensive Trading Report - ${getMonthName(currentDate)}`;
            const titleWidth = pdf.getTextWidth(title);
            pdf.text(title, (pageWidth - titleWidth) / 2, pageHeight / 2);
            
            pdf.setFontSize(11);
            pdf.setTextColor(0, 0, 0);
            pdf.text(`Account: ${accountName || 'N/A'}`, margin, pageHeight / 2 + 40);
            pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, pageHeight / 2 + 52);
        }
        
        // Start new page for content
        pdf.addPage();
        yPosition = margin;
        
        // EXECUTIVE SUMMARY
        addSectionHeader('Executive Summary');
        const analytics = calculateAnalytics();
        
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        
        const summaryData = [
            [`Total Trades`, `${analytics.totalTrades}`],
            [`Winning Trades`, `${analytics.totalWins} (${analytics.winRate.toFixed(1)}%)`],
            [`Losing Trades`, `${analytics.totalLosses} (${(100 - analytics.winRate).toFixed(1)}%)`],
            [`Average Win`, `$${analytics.averageWin.toFixed(2)}`],
            [`Average Loss`, `$${analytics.averageLoss.toFixed(2)}`],
            [`Risk/Reward Ratio`, `1:${analytics.averageWin > 0 ? (analytics.averageWin / analytics.averageLoss).toFixed(2) : '0'}`],
            [`Profit Factor`, `${analytics.profitFactor === Infinity ? '∞' : analytics.profitFactor.toFixed(2)}`],
            [`Net P&L`, `$${analytics.netPnL.toFixed(2)}`],
            [`Largest Win`, `$${Math.max(...getCurrentMonthTrades().map(t => t.amount)).toFixed(2)}`],
            [`Largest Loss`, `$${Math.min(...getCurrentMonthTrades().map(t => t.amount)).toFixed(2)}`]
        ];
        
        // Create two-column summary
        const midPoint = Math.ceil(summaryData.length / 2);
        const leftColumn = summaryData.slice(0, midPoint);
        const rightColumn = summaryData.slice(midPoint);
        
        leftColumn.forEach(([label, value], index) => {
            pdf.text(label + ':', margin, yPosition);
            pdf.text(value, margin + 50, yPosition);
            
            // Add right column data if available
            if (rightColumn[index]) {
                const [rightLabel, rightValue] = rightColumn[index];
                pdf.text(rightLabel + ':', margin + 100, yPosition);
                pdf.text(rightValue, margin + 150, yPosition);
            }
            yPosition += 6;
        });
        
        yPosition += 10;
        
        // PERFORMANCE ANALYSIS BY GROUPS
        addSectionHeader('Performance Analysis');
        
        // Day of Week Analysis
        addSectionHeader('By Day of Week', 12);
        const dayMetrics = getChartMetrics('dayOfWeek');
        
        pdf.setFontSize(9);
        Object.entries(dayMetrics).forEach(([day, metrics]) => {
            checkNewPage(8);
            const color = metrics.total >= 0 ? [34, 197, 94] : [239, 68, 68];
            pdf.setTextColor(...color);
            pdf.text(`${day}: $${metrics.total.toFixed(2)} (${metrics.trades} trades, ${metrics.winRate}% win rate)`, margin, yPosition);
            yPosition += 5;
        });
        
        yPosition += 5;
        pdf.setTextColor(0, 0, 0);
        
        // Trading Session Analysis
        addSectionHeader('By Trading Session', 12);
        const sessionMetrics = getChartMetrics('session');
        
        Object.entries(sessionMetrics).forEach(([session, metrics]) => {
            checkNewPage(8);
            const color = metrics.total >= 0 ? [34, 197, 94] : [239, 68, 68];
            pdf.setTextColor(...color);
            pdf.text(`${session}: $${metrics.total.toFixed(2)} (${metrics.trades} trades, ${metrics.winRate}% win rate)`, margin, yPosition);
            yPosition += 5;
        });
        
        yPosition += 5;
        pdf.setTextColor(0, 0, 0);
        
        // Strategy Analysis
        addSectionHeader('By Strategy', 12);
        const strategyMetrics = getChartMetrics('strategy');
        
        Object.entries(strategyMetrics).forEach(([strategy, metrics]) => {
            checkNewPage(8);
            const color = metrics.total >= 0 ? [34, 197, 94] : [239, 68, 68];
            pdf.setTextColor(...color);
            pdf.text(`${strategy}: $${metrics.total.toFixed(2)} (${metrics.trades} trades, ${metrics.winRate}% win rate)`, margin, yPosition);
            yPosition += 5;
        });
        
        yPosition += 5;
        pdf.setTextColor(0, 0, 0);
        
        // Asset Analysis
        addSectionHeader('By Asset', 12);
        const assetMetrics = getChartMetrics('asset');
        
        Object.entries(assetMetrics).forEach(([asset, metrics]) => {
            checkNewPage(8);
            const color = metrics.total >= 0 ? [34, 197, 94] : [239, 68, 68];
            pdf.setTextColor(...color);
            pdf.text(`${asset}: $${metrics.total.toFixed(2)} (${metrics.trades} trades, ${metrics.winRate}% win rate)`, margin, yPosition);
            yPosition += 5;
        });
        
        yPosition += 10;
        pdf.setTextColor(0, 0, 0);
        
        // ADDITIONAL INSIGHTS
        addSectionHeader('Trading Insights');
        
        const monthTrades = getCurrentMonthTrades();
        
        // Best and worst performing days
        const dayTotals = {};
        monthTrades.forEach(trade => {
            const day = new Date(trade.date_entered).toISOString().split('T')[0];
            dayTotals[day] = (dayTotals[day] || 0) + trade.amount;
        });
        
        const sortedDays = Object.entries(dayTotals).sort((a, b) => b[1] - a[1]);
        
        if (sortedDays.length > 0) {
            checkNewPage(15);
            pdf.text(`Best Trading Day: ${new Date(sortedDays[0][0]).toLocaleDateString()} ($${sortedDays[0][1].toFixed(2)})`, margin, yPosition);
            yPosition += 6;
            
            if (sortedDays.length > 1) {
                const worstDay = sortedDays[sortedDays.length - 1];
                pdf.text(`Worst Trading Day: ${new Date(worstDay[0]).toLocaleDateString()} ($${worstDay[1].toFixed(2)})`, margin, yPosition);
                yPosition += 6;
            }
        }
        
        // Consecutive wins/losses analysis
        let currentStreak = 0;
        let maxWinStreak = 0;
        let maxLossStreak = 0;
        let streakType = null;
        
        monthTrades.sort((a, b) => new Date(a.date_entered) - new Date(b.date_entered)).forEach(trade => {
            if (trade.amount > 0) {
                if (streakType === 'win') {
                    currentStreak++;
                } else {
                    currentStreak = 1;
                    streakType = 'win';
                }
                maxWinStreak = Math.max(maxWinStreak, currentStreak);
            } else if (trade.amount < 0) {
                if (streakType === 'loss') {
                    currentStreak++;
                } else {
                    currentStreak = 1;
                    streakType = 'loss';
                }
                maxLossStreak = Math.max(maxLossStreak, currentStreak);
            }
        });
        
        checkNewPage(12);
        pdf.text(`Longest Winning Streak: ${maxWinStreak} trades`, margin, yPosition);
        yPosition += 6;
        pdf.text(`Longest Losing Streak: ${maxLossStreak} trades`, margin, yPosition);
        yPosition += 10;
        
        // Capture and add charts if analytics are shown
        if (showAnalytics) {
            addSectionHeader('Visual Analysis');
            
            const chartElements = [
                { selector: '[data-chart="dayOfWeek"]', title: 'Performance by Day of Week' },
                { selector: '[data-chart="session"]', title: 'Performance by Trading Session' },
                { selector: '[data-chart="strategy"]', title: 'Performance by Strategy' },
                { selector: '[data-chart="asset"]', title: 'Performance by Asset' },
                { selector: '[data-chart="equity"]', title: 'Equity Curve' }
            ];
            
            for (const { selector, title } of chartElements) {
                const chartElement = document.querySelector(selector);
                if (chartElement) {
                    checkNewPage(100);
                    
                    try {
                        const canvas = await html2canvas(chartElement, {
                            scale: 2,
                            logging: false,
                            useCORS: true
                        });
                        
                        const imgData = canvas.toDataURL('image/png');
                        const imgWidth = pageWidth - 2 * margin;
                        const imgHeight = (canvas.height * imgWidth) / canvas.width;
                        
                        // Add chart title
                        pdf.setFontSize(12);
                        pdf.setTextColor(0, 124, 186);
                        pdf.text(title, margin, yPosition);
                        yPosition += 10;
                        
                        // Add chart image
                        pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
                        yPosition += imgHeight + 15;
                        
                    } catch (chartError) {
                        console.warn(`Failed to capture ${title}:`, chartError);
                    }
                }
            }
        }
        
        // DETAILED TRADE LOG
        pdf.addPage();
        yPosition = margin;
        
        addSectionHeader('Detailed Trade Log');
        
        if (monthTrades.length > 0) {
            // Group trades by week
            const weeklyTrades = {};
            monthTrades.forEach(trade => {
                const tradeDate = new Date(trade.date_entered);
                const weekStart = new Date(tradeDate);
                weekStart.setDate(tradeDate.getDate() - tradeDate.getDay());
                const weekKey = weekStart.toISOString().split('T')[0];
                
                if (!weeklyTrades[weekKey]) {
                    weeklyTrades[weekKey] = [];
                }
                weeklyTrades[weekKey].push(trade);
            });
            
            // Sort weeks chronologically
            const sortedWeeks = Object.keys(weeklyTrades).sort();
            
            sortedWeeks.forEach(weekStart => {
                const weekTrades = weeklyTrades[weekStart];
                const weekTotal = weekTrades.reduce((sum, trade) => sum + trade.amount, 0);
                
                checkNewPage(20);
                
                // Week header
                pdf.setFontSize(11);
                pdf.setTextColor(0, 124, 186);
                const weekStartDate = new Date(weekStart);
                const weekEndDate = new Date(weekStart);
                weekEndDate.setDate(weekStartDate.getDate() + 6);
                
                pdf.text(
                    `Week of ${weekStartDate.toLocaleDateString()} - ${weekEndDate.toLocaleDateString()} | ` +
                    `Total: $${weekTotal.toFixed(2)} | Trades: ${weekTrades.length}`,
                    margin, yPosition
                );
                yPosition += 8;
                
                // Table headers
                pdf.setFontSize(8);
                pdf.setTextColor(0, 0, 0);
                
                const headers = ['Date', 'Asset', 'Strategy', 'Session', 'Outcome', 'Amount'];
                const colWidths = [20, 25, 30, 25, 20, 20];
                let xPos = margin;
                
                // Draw headers
                headers.forEach((header, i) => {
                    pdf.text(header, xPos, yPosition);
                    xPos += colWidths[i];
                });
                yPosition += 6;
                
                // Draw line under headers
                pdf.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2);
                yPosition += 2;
                
                // Add trade rows for this week
                weekTrades.forEach(trade => {
                    checkNewPage(8);
                    
                    xPos = margin;
                    const tradeDate = new Date(trade.date_entered).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                    });
                    
                    const rowData = [
                        tradeDate,
                        trade.asset || 'N/A',
                        trade.strategy || 'N/A',
                        trade.trading_session_entered || 'N/A',
                        trade.outcome || 'N/A',
                        `$${trade.amount.toFixed(2)}`
                    ];
                    
                    // Set color based on profit/loss
                    if (trade.amount > 0) {
                        pdf.setTextColor(34, 197, 94);
                    } else if (trade.amount < 0) {
                        pdf.setTextColor(239, 68, 68);
                    } else {
                        pdf.setTextColor(0, 0, 0);
                    }
                    
                    rowData.forEach((data, i) => {
                        const truncatedData = data.length > 12 ? data.substring(0, 10) + '..' : data;
                        pdf.text(truncatedData, xPos, yPosition);
                        xPos += colWidths[i];
                    });
                    yPosition += 5;
                });
                
                yPosition += 5; // Space between weeks
                pdf.setTextColor(0, 0, 0); // Reset color
            });
        } else {
            pdf.text('No trades found for this month.', margin, yPosition);
        }
        
        // REFLECTION SECTION (if reflections exist)
        const tradesWithReflections = monthTrades.filter(trade => trade.reflection && trade.reflection.trim());
        if (tradesWithReflections.length > 0) {
            pdf.addPage();
            yPosition = margin;
            
            addSectionHeader('Trade Reflections & Lessons');
            
            pdf.setFontSize(9);
            tradesWithReflections.forEach((trade, index) => {
                checkNewPage(25);
                
                pdf.setTextColor(0, 124, 186);
                pdf.text(`Trade ${index + 1}: ${trade.asset} - ${new Date(trade.date_entered).toLocaleDateString()}`, margin, yPosition);
                yPosition += 6;
                
                pdf.setTextColor(0, 0, 0);
                const reflection = trade.reflection;
                const lines = pdf.splitTextToSize(reflection, pageWidth - 2 * margin);
                
                lines.forEach(line => {
                    checkNewPage(6);
                    pdf.text(line, margin, yPosition);
                    yPosition += 5;
                });
                
                yPosition += 3;
            });
        }
        
        // Save the PDF
        const fileName = `Comprehensive_Trading_Report_${getMonthName(currentDate).replace(' ', '_')}.pdf`;
        pdf.save(fileName);
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF report. Please try again.');
    } finally {
        setDownloadingPDF(false);
    }
};


    // Add data attributes to chart containers for PDF capture
    const getChartDataAttribute = (chartType) => {
        return { 'data-chart': chartType };
    };

    // Add this function to calculate detailed metrics for each chart
    const getChartMetrics = (chartType) => {
        const monthTrades = getCurrentMonthTrades();
        
        switch(chartType) {
            case 'dayOfWeek':
                const dayStats = {};
                const dayPerformance = {
                    'Monday': [], 'Tuesday': [], 'Wednesday': [], 'Thursday': [], 
                    'Friday': [], 'Saturday': [], 'Sunday': []
                };
                
                monthTrades.forEach(trade => {
                    if (trade.day_of_week_entered && dayPerformance.hasOwnProperty(trade.day_of_week_entered)) {
                        dayPerformance[trade.day_of_week_entered].push(trade.amount);
                    }
                });
                
                Object.keys(dayPerformance).forEach(day => {
                    const trades = dayPerformance[day];
                    const wins = trades.filter(t => t > 0);
                    const losses = trades.filter(t => t < 0);
                    const total = trades.reduce((sum, t) => sum + t, 0);
                    
                    dayStats[day] = {
                        total: total,
                        trades: trades.length,
                        wins: wins.length,
                        losses: losses.length,
                        winRate: trades.length > 0 ? (wins.length / trades.length * 100).toFixed(1) : 0,
                        avgTrade: trades.length > 0 ? (total / trades.length).toFixed(2) : 0
                    };
                });
                return dayStats;
                
            case 'session':
                const sessionStats = {};
                const sessionPerformance = {};
                
                monthTrades.forEach(trade => {
                    if (trade.trading_session_entered) {
                        if (!sessionPerformance[trade.trading_session_entered]) {
                            sessionPerformance[trade.trading_session_entered] = [];
                        }
                        sessionPerformance[trade.trading_session_entered].push(trade.amount);
                    }
                });
                
                Object.keys(sessionPerformance).forEach(session => {
                    const trades = sessionPerformance[session];
                    const wins = trades.filter(t => t > 0);
                    const losses = trades.filter(t => t < 0);
                    const total = trades.reduce((sum, t) => sum + t, 0);
                    
                    sessionStats[session] = {
                        total: total,
                        trades: trades.length,
                        wins: wins.length,
                        losses: losses.length,
                        winRate: trades.length > 0 ? (wins.length / trades.length * 100).toFixed(1) : 0,
                        avgTrade: trades.length > 0 ? (total / trades.length).toFixed(2) : 0
                    };
                });
                return sessionStats;
                
            case 'strategy':
                const strategyStats = {};
                const strategyPerformance = {};
                
                monthTrades.forEach(trade => {
                    if (trade.strategy) {
                        if (!strategyPerformance[trade.strategy]) {
                            strategyPerformance[trade.strategy] = [];
                        }
                        strategyPerformance[trade.strategy].push(trade.amount);
                    }
                });
                
                Object.keys(strategyPerformance).forEach(strategy => {
                    const trades = strategyPerformance[strategy];
                    const wins = trades.filter(t => t > 0);
                    const losses = trades.filter(t => t < 0);
                    const total = trades.reduce((sum, t) => sum + t, 0);
                    
                    strategyStats[strategy] = {
                        total: total,
                        trades: trades.length,
                        wins: wins.length,
                        losses: losses.length,
                        winRate: trades.length > 0 ? (wins.length / trades.length * 100).toFixed(1) : 0,
                        avgTrade: trades.length > 0 ? (total / trades.length).toFixed(2) : 0
                    };
                });
                return strategyStats;
                
            case 'asset':
                const assetStats = {};
                const assetPerformance = {};
                
                monthTrades.forEach(trade => {
                    if (trade.asset) {
                        if (!assetPerformance[trade.asset]) {
                            assetPerformance[trade.asset] = [];
                        }
                        assetPerformance[trade.asset].push(trade.amount);
                    }
                });
                
                Object.keys(assetPerformance).forEach(asset => {
                    const trades = assetPerformance[asset];
                    const wins = trades.filter(t => t > 0);
                    const losses = trades.filter(t => t < 0);
                    const total = trades.reduce((sum, t) => sum + t, 0);
                    
                    assetStats[asset] = {
                        total: total,
                        trades: trades.length,
                        wins: wins.length,
                        losses: losses.length,
                        winRate: trades.length > 0 ? (wins.length / trades.length * 100).toFixed(1) : 0,
                        avgTrade: trades.length > 0 ? (total / trades.length).toFixed(2) : 0
                    };
                });
                return assetStats;
                
            default:
                return {};
        }
    };

    // Get trades for current month
    const getCurrentMonthTrades = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        return trades.filter(trade => {
            if (!trade.date_entered) return false;
            const tradeDate = new Date(trade.date_entered);
            return tradeDate.getFullYear() === year && tradeDate.getMonth() === month;
        });
    };

    // Analytics calculations
    const calculateAnalytics = () => {
        const monthTrades = getCurrentMonthTrades();
        
        if (monthTrades.length === 0) {
            return {
                winRate: 0,
                averageWin: 0,
                averageLoss: 0,
                profitFactor: 0,
                totalWins: 0,
                totalLosses: 0,
                totalTrades: 0,
                netPnL: 0
            };
        }

        const wins = monthTrades.filter(trade => trade.amount > 0);
        const losses = monthTrades.filter(trade => trade.amount < 0);
        
        const totalWins = wins.reduce((sum, trade) => sum + trade.amount, 0);
        const totalLosses = Math.abs(losses.reduce((sum, trade) => sum + trade.amount, 0));
        
        const winRate = (wins.length / monthTrades.length) * 100;
        const averageWin = wins.length > 0 ? totalWins / wins.length : 0;
        const averageLoss = losses.length > 0 ? totalLosses / losses.length : 0;
        const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? Infinity : 0;
        const netPnL = monthTrades.reduce((sum, trade) => sum + trade.amount, 0);

        return {
            winRate,
            averageWin,
            averageLoss,
            profitFactor,
            totalWins: wins.length,
            totalLosses: losses.length,
            totalTrades: monthTrades.length,
            netPnL
        };
    };

    // Performance by day of week
    const getDayOfWeekPerformance = () => {
        const monthTrades = getCurrentMonthTrades();
        const dayPerformance = {
            'Monday': 0, 'Tuesday': 0, 'Wednesday': 0, 'Thursday': 0, 
            'Friday': 0, 'Saturday': 0, 'Sunday': 0
        };

        monthTrades.forEach(trade => {
            if (trade.day_of_week_entered && dayPerformance.hasOwnProperty(trade.day_of_week_entered)) {
                dayPerformance[trade.day_of_week_entered] += trade.amount;
            }
        });

        return {
            labels: Object.keys(dayPerformance),
            datasets: [{
                label: 'P&L by Day of Week',
                data: Object.values(dayPerformance),
                backgroundColor: Object.values(dayPerformance).map(value => 
                    value >= 0 ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.6)'
                ),
                borderColor: Object.values(dayPerformance).map(value => 
                    value >= 0 ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)'
                ),
                borderWidth: 1
            }]
        };
    };

    // Performance by trading session
    const getTradingSessionPerformance = () => {
        const monthTrades = getCurrentMonthTrades();
        const sessionPerformance = {};

        monthTrades.forEach(trade => {
            if (trade.trading_session_entered) {
                if (!sessionPerformance[trade.trading_session_entered]) {
                    sessionPerformance[trade.trading_session_entered] = 0;
                }
                sessionPerformance[trade.trading_session_entered] += trade.amount;
            }
        });

        return {
            labels: Object.keys(sessionPerformance),
            datasets: [{
                label: 'P&L by Trading Session',
                data: Object.values(sessionPerformance),
                backgroundColor: Object.values(sessionPerformance).map(value => 
                    value >= 0 ? 'rgba(59, 130, 246, 0.6)' : 'rgba(239, 68, 68, 0.6)'
                ),
                borderColor: Object.values(sessionPerformance).map(value => 
                    value >= 0 ? 'rgba(59, 130, 246, 1)' : 'rgba(239, 68, 68, 1)'
                ),
                borderWidth: 1
            }]
        };
    };

    // Performance by strategy
    const getStrategyPerformance = () => {
        const monthTrades = getCurrentMonthTrades();
        const strategyPerformance = {};

        monthTrades.forEach(trade => {
            if (trade.strategy) {
                if (!strategyPerformance[trade.strategy]) {
                    strategyPerformance[trade.strategy] = 0;
                }
                strategyPerformance[trade.strategy] += trade.amount;
            }
        });

        return {
            labels: Object.keys(strategyPerformance),
            datasets: [{
                label: 'P&L by Strategy',
                data: Object.values(strategyPerformance),
                backgroundColor: Object.values(strategyPerformance).map(value => 
                    value >= 0 ? 'rgba(168, 85, 247, 0.6)' : 'rgba(239, 68, 68, 0.6)'
                ),
                borderColor: Object.values(strategyPerformance).map(value => 
                    value >= 0 ? 'rgba(168, 85, 247, 1)' : 'rgba(239, 68, 68, 1)'
                ),
                borderWidth: 1
            }]
        };
    };

    // Performance by asset
    const getAssetPerformance = () => {
        const monthTrades = getCurrentMonthTrades();
        const assetPerformance = {};

        monthTrades.forEach(trade => {
            if (trade.asset) {
                if (!assetPerformance[trade.asset]) {
                    assetPerformance[trade.asset] = 0;
                }
                assetPerformance[trade.asset] += trade.amount;
            }
        });

        return {
            labels: Object.keys(assetPerformance),
            datasets: [{
                label: 'P&L by Asset',
                data: Object.values(assetPerformance),
                backgroundColor: Object.values(assetPerformance).map(value => 
                    value >= 0 ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.6)'
                ),
                borderColor: Object.values(assetPerformance).map(value => 
                    value >= 0 ? 'rgba(16, 185, 129, 1)' : 'rgba(239, 68, 68, 1)'
                ),
                borderWidth: 1
            }]
        };
    };

    // Equity curve
    const getEquityCurve = () => {
        const monthTrades = getCurrentMonthTrades()
            .sort((a, b) => new Date(a.date_entered) - new Date(b.date_entered));

        let runningTotal = 0;
        const equityData = [0]; // Start at 0
        const labels = ['Start'];

        monthTrades.forEach((trade, index) => {
            runningTotal += trade.amount;
            equityData.push(runningTotal);
            labels.push(`Trade ${index + 1}`);
        });

        return {
            labels,
            datasets: [{
                label: 'Equity Curve',
                data: equityData,
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.1
            }]
        };
    };

    // Updated chart options with click handler
    const getChartOptions = (chartType) => ({
        responsive: true,
        maintainAspectRatio: false,
        onClick: () => handleChartClick(chartType),
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return '$' + value;
                    }
                }
            }
        }
    });

    // Special options for equity curve to fix stretching
    const getEquityChartOptions = () => ({
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: window.innerWidth < 768 ? 1.5 : 2.5, // Better aspect ratio for desktop
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return '$' + value;
                    }
                }
            }
        }
    });

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        
        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }
        
        return days;
    };

    const getTradesForDate = (day) => {
        if (!day) return [];
        // 
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const dateString = new Date(year, month, day).toISOString().split('T')[0];
        
        return trades.filter(trade => {
            if (!trade.date_entered) return false;
            const tradeDate = new Date(trade.date_entered).toISOString().split('T')[0];
            return tradeDate === dateString;
        });
    };

    const handleDateClick = (day) => {
        if (!day) return;
        
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const clickedDate = new Date(year, month, day);
        
        const dayTrades = getTradesForDate(day);
        
        if (selectedDate && selectedDate.getTime() === clickedDate.getTime()) {
            // If clicking the same date, close it
            setSelectedDate(null);
            setSelectedTrades([]);
        } else {
            setSelectedDate(clickedDate);
            setSelectedTrades(dayTrades);
        }
    };

    // Handle chart click
    const handleChartClick = (chartType) => {
        if (selectedChart === chartType) {
            setSelectedChart(null);
            setChartMetrics({});
        } else {
            setSelectedChart(chartType);
            setChartMetrics(getChartMetrics(chartType));
        }
    };

    const navigateMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);
        setCurrentDate(newDate);
        setSelectedDate(null);
        setSelectedTrades([]);
    };

    const getMonthName = (date) => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const getProfitLossColor = (outcome, amount) => {
        if (amount < 0) return 'loss';
        if (amount > 0) return 'profit';
        if (amount === 0) return 'neutral';
        return 'neutral';
    };

    const formatAmount = (amount) => {
        if (amount === 0) return '0';
        const absAmount = Math.abs(amount);
        if (absAmount >= 1000) {
            return (absAmount / 1000).toFixed(1) + 'k';
        }
        return absAmount.toString();
    };

    // Fixed currency formatting function
    const formatCurrency = (amount) => {
        if (amount === 0) return '$0';
        if (amount < 0) {
            return `-$${Math.abs(amount)}`;
        } else {
            return `$${amount}`;
        }
    };

    const getDayTotal = (dayTrades) => {
        return dayTrades.reduce((total, trade) => total + trade.amount, 0);
    };

    const handleRetry = () => {
        fetchTrades();
    };

    const days = getDaysInMonth(currentDate);
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const analytics = calculateAnalytics();

    // Error state
    if (error && !loading) {
        return (
            <div>
                <div className="header">
                    <Header />
                </div>
                <div className="main-page-body">
                    <SideNavs />
                    <div className="main-body-info">
                        <h5 className="major-upcoming-news-events-header">Trading Calendar</h5>
                        <div className="error-container" style={{
                            background: '#fee',
                            border: '1px solid #fcc',
                            borderRadius: '8px',
                            padding: '20px',
                            margin: '20px 0',
                            textAlign: 'center'
                        }}>
                            <h4 style={{color: '#c33', marginBottom: '10px'}}>
                                Unable to Load Trading Data
                            </h4>
                            <p style={{color: '#666', marginBottom: '15px'}}>
                                {error}
                            </p>
                            <button 
                                onClick={handleRetry}
                                style={{
                                    background: '#007cba',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Loading state
    if (loading) {
        return (
            <div>
                <div className="header">
                    <Header />
                </div>
                <div className="main-page-body">
                    <SideNavs />
                    <div className="main-body-info">
                        <h5 className="major-upcoming-news-events-header">Trading Calendar</h5>
                        <div className="loading" style={{
                            textAlign: 'center',
                            padding: '40px',
                            color: '#666'
                        }}>
                            Loading trades...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">Trading Calendar</h5><br />
                    
                    {/* Control Buttons */}
                    <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button 
                            onClick={() => setShowAnalytics(!showAnalytics)}
                            style={{
                                background: showAnalytics ? '#ef4444' : '#007cba',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
                        </button>
                        
                        <button 
                            onClick={downloadMonthlyReport}
                            disabled={downloadingPDF}
                            style={{
                                background: downloadingPDF ? '#9ca3af' : '#22c55e',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: downloadingPDF ? 'not-allowed' : 'pointer',
                                opacity: downloadingPDF ? 0.7 : 1
                            }}
                        >
                            {downloadingPDF ? 'Generating PDF...' : 'Download Monthly Report'}
                        </button>
                    </div>

                    {/* Analytics Section */}
                    {showAnalytics && (
                        <div style={{ marginBottom: '30px' }}>
                            {/* Key Metrics */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '15px',
                                marginBottom: '30px'
                            }}>
                                <div style={{
                                    background: '#f8f9fa',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef'
                                }}>
                                    <h6 style={{ margin: '0 0 5px 0', color: '#666' }}>Win Rate</h6>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: analytics.winRate >= 50 ? '#22c55e' : '#ef4444' }}>
                                        {analytics.winRate.toFixed(1)}%
                                    </div>
                                </div>
                                <div style={{
                                    background: '#f8f9fa',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef'
                                }}>
                                    <h6 style={{ margin: '0 0 5px 0', color: '#666' }}>Average Win</h6>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#22c55e' }}>
                                        ${analytics.averageWin.toFixed(2)}
                                    </div>
                                </div>
                                <div style={{
                                    background: '#f8f9fa',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef'
                                }}>
                                    <h6 style={{ margin: '0 0 5px 0', color: '#666' }}>Average Loss</h6>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ef4444' }}>
                                        ${analytics.averageLoss.toFixed(2)}
                                    </div>
                                </div>
                                <div style={{
                                    background: '#f8f9fa',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef'
                                }}>
                                    <h6 style={{ margin: '0 0 5px 0', color: '#666' }}>Profit Factor</h6>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: analytics.profitFactor >= 1 ? '#22c55e' : '#ef4444' }}>
                                        {analytics.profitFactor === Infinity ? '∞' : analytics.profitFactor.toFixed(2)}
                                    </div>
                                </div>
                                <div style={{
                                    background: '#f8f9fa',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef'
                                }}>
                                    <h6 style={{ margin: '0 0 5px 0', color: '#666' }}>Net P&L</h6>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: analytics.netPnL >= 0 ? '#22c55e' : '#ef4444' }}>
                                        ${analytics.netPnL.toFixed(2)}
                                    </div>
                                </div>
                                <div style={{
                                    background: '#f8f9fa',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef'
                                }}>
                                    <h6 style={{ margin: '0 0 5px 0', color: '#666' }}>Total Trades</h6>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#6b7280' }}>
                                        {analytics.totalTrades}
                                    </div>
                                </div>
                            </div>

                            {/* Charts */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))',
                                gap: '20px',
                                marginBottom: '20px'
                            }}>
                                <div 
                                    {...getChartDataAttribute('dayOfWeek')}
                                    style={{ 
                                        background: '#f8f9fa', 
                                        padding: '15px', 
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        border: selectedChart === 'dayOfWeek' ? '2px solid #007cba' : '1px solid #e9ecef',
                                        transition: 'border-color 0.2s'
                                    }}
                                    onClick={() => handleChartClick('dayOfWeek')}
                                >
                                    <h6 style={{ marginBottom: '15px', fontSize: '14px' }}>Performance by Day of Week (Click for details)</h6>
                                    <div style={{ height: window.innerWidth < 768 ? '250px' : '300px' }}>
                                        <Bar data={getDayOfWeekPerformance()} options={getChartOptions('dayOfWeek')} />
                                    </div>
                                </div>
                                
                                <div 
                                    {...getChartDataAttribute('session')}
                                    style={{ 
                                        background: '#f8f9fa', 
                                        padding: '15px', 
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        border: selectedChart === 'session' ? '2px solid #007cba' : '1px solid #e9ecef',
                                        transition: 'border-color 0.2s'
                                    }}
                                    onClick={() => handleChartClick('session')}
                                >
                                    <h6 style={{ marginBottom: '15px', fontSize: '14px' }}>Performance by Trading Session (Click for details)</h6>
                                    <div style={{ height: window.innerWidth < 768 ? '250px' : '300px' }}>
                                        <Bar data={getTradingSessionPerformance()} options={getChartOptions('session')} />
                                    </div>
                                </div>
                                
                                <div 
                                    {...getChartDataAttribute('strategy')}
                                    style={{ 
                                        background: '#f8f9fa', 
                                        padding: '15px', 
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        border: selectedChart === 'strategy' ? '2px solid #007cba' : '1px solid #e9ecef',
                                        transition: 'border-color 0.2s'
                                    }}
                                    onClick={() => handleChartClick('strategy')}
                                >
                                    <h6 style={{ marginBottom: '15px', fontSize: '14px' }}>Performance by Strategy (Click for details)</h6>
                                    <div style={{ height: window.innerWidth < 768 ? '250px' : '300px' }}>
                                        <Bar data={getStrategyPerformance()} options={getChartOptions('strategy')} />
                                    </div>
                                </div>
                                
                                <div 
                                    {...getChartDataAttribute('asset')}
                                    style={{ 
                                        background: '#f8f9fa', 
                                        padding: '15px', 
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        border: selectedChart === 'asset' ? '2px solid #007cba' : '1px solid #e9ecef',
                                        transition: 'border-color 0.2s'
                                    }}
                                    onClick={() => handleChartClick('asset')}
                                >
                                    <h6 style={{ marginBottom: '15px', fontSize: '14px' }}>Performance by Asset (Click for details)</h6>
                                    <div style={{ height: window.innerWidth < 768 ? '250px' : '300px' }}>
                                        <Bar data={getAssetPerformance()} options={getChartOptions('asset')} />
                                    </div>
                                </div>
                            </div>

                            {/* Chart Metrics Modal */}
                            {selectedChart && Object.keys(chartMetrics).length > 0 && (
                                <div style={{
                                    background: '#f8f9fa',
                                    border: '2px solid #007cba',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    marginBottom: '20px',
                                    position: 'relative'
                                }}>
                                    <button 
                                        onClick={() => setSelectedChart(null)}
                                        style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '20px',
                                            cursor: 'pointer',
                                            color: '#666'
                                        }}
                                    >
                                        ×
                                    </button>
                                    
                                    <h6 style={{ marginBottom: '15px', color: '#007cba' }}>
                                        Detailed Metrics - {selectedChart.charAt(0).toUpperCase() + selectedChart.slice(1)}
                                    </h6>
                                    
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
                                        gap: '15px'
                                    }}>
                                        {Object.entries(chartMetrics).map(([key, metrics]) => (
                                            <div key={key} style={{
                                                background: 'white',
                                                padding: '15px',
                                                borderRadius: '6px',
                                                border: '1px solid #e9ecef'
                                            }}>
                                                <h6 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '14px' }}>{key}</h6>
                                                <div style={{ fontSize: '12px', color: '#666' }}>
                                                    <div>Total P&L: <span style={{ color: metrics.total >= 0 ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>
                                                        ${metrics.total.toFixed(2)}
                                                    </span></div>
                                                    <div>Trades: {metrics.trades}</div>
                                                    <div>Wins: {metrics.wins} | Losses: {metrics.losses}</div>
                                                    <div>Win Rate: {metrics.winRate}%</div>
                                                    <div>Avg Trade: ${metrics.avgTrade}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Equity Curve - Fixed stretching issue */}
                            <div 
                                {...getChartDataAttribute('equity')}
                                style={{ 
                                    background: '#f8f9fa', 
                                    padding: '20px', 
                                    borderRadius: '8px', 
                                    marginBottom: '20px' 
                                }}
                            >
                                <h6 style={{ marginBottom: '15px' }}>Equity Curve</h6>
                                <div style={{ height: window.innerWidth < 768 ? '300px' : '400px' }}>
                                    <Line data={getEquityCurve()} options={getEquityChartOptions()} />
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="calendar-container">
                        <div className="calendar-header">
                            <button 
                                className="nav-button" 
                                onClick={() => navigateMonth(-1)}
                            >
                                &#8249;
                            </button>
                            <h3 className="month-year">{getMonthName(currentDate)}</h3>
                            <button 
                                className="nav-button" 
                                onClick={() => navigateMonth(1)}
                            >
                                &#8250;
                            </button>
                        </div>

                        <div className="calendar-grid">
                            {weekdays.map(day => (
                                <div key={day} className="weekday-header">
                                    {day}
                                </div>
                            ))}
                            
                            {days.map((day, index) => {
                                const dayTrades = getTradesForDate(day);
                                const isSelected = selectedDate && 
                                    selectedDate.getDate() === day && 
                                    selectedDate.getMonth() === currentDate.getMonth();
                                
                                return (
                                    <div
                                        key={index}
                                        className={`calendar-day ${day ? 'active' : 'inactive'} ${isSelected ? 'selected' : ''}`}
                                        onClick={() => handleDateClick(day)}
                                    >
                                        {day && (
                                            <>
                                                <span className="day-number">{day}</span>
                                                {dayTrades.length > 0 && (
                                                    <div className="trade-amounts">
                                                        {dayTrades.slice(0, 4).map((trade, i) => (
                                                            <div
                                                                key={i}
                                                                className={`trade-amount ${getProfitLossColor(trade.outcome, trade.amount)}`}
                                                                title={`${trade.asset} - ${trade.outcome}: ${formatCurrency(trade.amount)}`}
                                                            >
                                                                {trade.amount > 0 ? '+' : '-'}{formatAmount(trade.amount)}
                                                            </div>
                                                        ))}
                                                        {dayTrades.length > 4 && (
                                                            <div className="trade-count">+{dayTrades.length - 4}</div>
                                                        )}
                                                        {dayTrades.length > 1 && (
                                                            <div className={`day-total ${getProfitLossColor('', getDayTotal(dayTrades))}`}>
                                                                Total: {getDayTotal(dayTrades) > 0 ? '+' : ''}{formatAmount(getDayTotal(dayTrades))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {selectedDate && selectedTrades.length > 0 && (
                            <div className="trade-details">
                                <h4>Trades for {selectedDate.toLocaleDateString()}</h4>
                                <div className="trades-list">
                                    {selectedTrades.map((trade, index) => (
                                        <div key={index} className="trade-card">
                                            <div className="trade-header">
                                                <h5>{trade.asset}</h5>
                                                <span className={`trade-outcome ${getProfitLossColor(trade.outcome, trade.amount)}`}>
                                                    {formatCurrency(trade.amount)}
                                                </span>
                                            </div>
                                            <div className="trade-info">
                                                <div className="trade-row">
                                                    <span className="label">Order Type:</span>
                                                    <span>{trade.order_type}</span>
                                                </div>
                                                <div className="trade-row">
                                                    <span className="label">Strategy:</span>
                                                    <span>{trade.strategy}</span>
                                                </div>
                                                <div className="trade-row">
                                                    <span className="label">Day Entered:</span>
                                                    <span>{trade.day_of_week_entered}</span>
                                                </div>
                                                {trade.day_of_week_closed && (
                                                    <div className="trade-row">
                                                        <span className="label">Day Closed:</span>
                                                        <span>{trade.day_of_week_closed}</span>
                                                    </div>
                                                )}
                                                <div className="trade-row">
                                                    <span className="label">Session Entered:</span>
                                                    <span>{trade.trading_session_entered}</span>
                                                </div>
                                                {trade.trading_session_closed && (
                                                    <div className="trade-row">
                                                        <span className="label">Session Closed:</span>
                                                        <span>{trade.trading_session_closed}</span>
                                                    </div>
                                                )}
                                                <div className="trade-row">
                                                    <span className="label">Outcome:</span>
                                                    <span className={getProfitLossColor(trade.outcome, trade.amount)}>
                                                        {trade.outcome}
                                                    </span>
                                                </div>
                                                {trade.emotional_bias && (
                                                    <div className="trade-row">
                                                        <span className="label">Emotional Bias:</span>
                                                        <span>{trade.emotional_bias}</span>
                                                    </div>
                                                )}
                                                {trade.reflection && (
                                                    <div className="trade-row">
                                                        <span className="label">Reflection:</span>
                                                        <span>{trade.reflection}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}