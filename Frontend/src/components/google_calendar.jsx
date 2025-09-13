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
import chinese_flag from '../chinese_flag.jpg';
import korean_flag from '../korean_flag.jpg';
import us_flag from '../us_flag.jpg';


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

    const [selectedLanguage, setSelectedLanguage] = useState('english');
    const [showLanguageSelector, setShowLanguageSelector] = useState(false);

    const translations = {
    english: {
        comprehensiveReport: 'Comprehensive Trading Report',
        executiveSummary: 'Executive Summary',
        totalTrades: 'Total Trades',
        winningTrades: 'Winning Trades',
        losingTrades: 'Losing Trades',
        averageWin: 'Average Win',
        averageLoss: 'Average Loss',
        riskRewardRatio: 'Risk/Reward Ratio',
        profitFactor: 'Profit Factor',
        netPL: 'Net P&L',
        largestWin: 'Largest Win',
        largestLoss: 'Largest Loss',
        performanceAnalysis: 'Performance Analysis',
        byDayOfWeek: 'By Day of Week',
        byTradingSession: 'By Trading Session',
        byStrategy: 'By Strategy',
        byAsset: 'By Asset',
        tradingInsights: 'Trading Insights:',
        bestTradingDay: 'Best Trading Day',
        worstTradingDay: 'Worst Trading Day',
        longestWinningStreak: 'Longest Winning Streak',
        longestLosingStreak: 'Longest Losing Streak',
        trades: 'trades',
        visualAnalysis: 'Visual Analysis',
        performanceByDayOfWeek: 'Performance by Day of Week',
        performanceByTradingSession: 'Performance by Trading Session',
        performanceByStrategy: 'Performance by Strategy',
        performanceByAsset: 'Performance by Asset',
        equityCurve: 'Equity Curve',
        detailedTradeLog: 'Detailed Trade Log',
        weekOf: 'Week of',
        total: 'Total',
        date: 'Date',
        asset: 'Asset',
        strategy: 'Strategy',
        session: 'Session',
        outcome: 'Outcome',
        amount: 'Amount',
        tradeReflections: 'Trade Reflections & Lessons',
        trade: 'Trade',
        winRate: 'win rate',
        page: 'Page'
    },
    chinese: {
        comprehensiveReport: '\u7EFC\u5408\u4EA4\u6613\u62A5\u544A',
        executiveSummary: '\u6267\u884C\u6458\u8981',
        totalTrades: '\u603B\u4EA4\u6613\u6570',
        winningTrades: '\u76C8\u5229\u4EA4\u6613',
        losingTrades: '\u4E8F\u635F\u4EA4\u6613',
        averageWin: '\u5E73\u5747\u76C8\u5229',
        averageLoss: '\u5E73\u5747\u4E8F\u635F',
        riskRewardRatio: '\u98CE\u9669/\u6536\u76CA\u6BD4',
        profitFactor: '\u76C8\u5229\u56E0\u5B50',
        netPL: '\u51C0\u76C8\u4E8F',
        largestWin: '\u6700\u5927\u76C8\u5229',
        largestLoss: '\u6700\u5927\u4E8F\u635F',
        performanceAnalysis: '\u7EE9\u6548\u5206\u6790',
        byDayOfWeek: '\u6309\u661F\u671F\u51E0',
        byTradingSession: '\u6309\u4EA4\u6613\u65F6\u6BB5',
        byStrategy: '\u6309\u7B56\u7565',
        byAsset: '\u6309\u8D44\u4EA7',
        tradingInsights: '\u4EA4\u6613\u6D1E\u5BDF:',
        bestTradingDay: '\u6700\u4F73\u4EA4\u6613\u65E5',
        worstTradingDay: '\u6700\u5DEE\u4EA4\u6613\u65E5',
        longestWinningStreak: '\u6700\u957F\u8FDE\u80DC',
        longestLosingStreak: '\u6700\u957F\u8FDE\u8D25',
        trades: '\u4EA4\u6613',
        visualAnalysis: '\u53EF\u89C6\u5316\u5206\u6790',
        performanceByDayOfWeek: '\u6309\u661F\u671F\u51E0\u7684\u8868\u73B0',
        performanceByTradingSession: '\u6309\u4EA4\u6613\u65F6\u6BB5\u7684\u8868\u73B0',
        performanceByStrategy: '\u6309\u7B56\u7565\u7684\u8868\u73B0',
        performanceByAsset: '\u6309\u8D44\u4EA7\u7684\u8868\u73B0',
        equityCurve: '\u8D44\u4EA7\u66F2\u7EBF',
        detailedTradeLog: '\u8BE6\u7EC6\u4EA4\u6613\u8BB0\u5F55',
        weekOf: '\u5468\u671F',
        total: '\u603B\u8BA1',
        date: '\u65E5\u671F',
        asset: '\u8D44\u4EA7',
        strategy: '\u7B56\u7565',
        session: '\u65F6\u6BB5',
        outcome: '\u7ED3\u679C',
        amount: '\u91D1\u989D',
        tradeReflections: '\u4EA4\u6613\u53CD\u601D\u4E0E\u6559\u8BAD',
        trade: '\u4EA4\u6613',
        winRate: '\u80DC\u7387',
        page: '\u9875'
    },
    korean: {
        comprehensiveReport: '\uC885\uD569 \uAC70\uB798 \uBCF4\uACE0\uC11C',
        executiveSummary: '\uC694\uC57D',
        totalTrades: '\uCD1D \uAC70\uB798\uC218',
        winningTrades: '\uC218\uC775 \uAC70\uB798',
        losingTrades: '\uC190\uC2E4 \uAC70\uB798',
        averageWin: '\uD3C9\uADE0 \uC218\uC775',
        averageLoss: '\uD3C9\uADE0 \uC190\uC2E4',
        riskRewardRatio: '\uC704\uD5D8/\uC218\uC775 \uBE44\uC728',
        profitFactor: '\uC218\uC775 \uD329\uD130',
        netPL: '\uC21C \uC190\uC775',
        largestWin: '\uCD5C\uB300 \uC218\uC775',
        largestLoss: '\uCD5C\uB300 \uC190\uC2E4',
        performanceAnalysis: '\uC131\uACFC \uBD84\uC11D',
        byDayOfWeek: '\uC694\uC77C\uBCC4',
        byTradingSession: '\uAC70\uB798 \uC138\uC158\uBCC4',
        byStrategy: '\uC804\uB7B5\uBCC4',
        byAsset: '\uC790\uC0B0\uBCC4',
        tradingInsights: '\uAC70\uB798 \uC778\uC0AC\uC774\uD2B8:',
        bestTradingDay: '\uCD5C\uACE0 \uAC70\uB798\uC77C',
        worstTradingDay: '\uCD5C\uC545 \uAC70\uB798\uC77C',
        longestWinningStreak: '\uCD5C\uC7A5 \uC5F0\uC2B9',
        longestLosingStreak: '\uCD5C\uC7A5 \uC5F0\uD328',
        trades: '\uAC70\uB798',
        visualAnalysis: '\uC2DC\uAC01\uC801 \uBD84\uC11D',
        performanceByDayOfWeek: '\uC694\uC77C\uBCC4 \uC131\uACFC',
        performanceByTradingSession: '\uAC70\uB798 \uC138\uC158\uBCC4 \uC131\uACFC',
        performanceByStrategy: '\uC804\uB7B5\uBCC4 \uC131\uACFC',
        performanceByAsset: '\uC790\uC0B0\uBCC4 \uC131\uACFC',
        equityCurve: '\uC790\uC0B0 \uACE1\uC120',
        detailedTradeLog: '\uC0C1\uC138 \uAC70\uB798 \uB85C\uADF8',
        weekOf: '\uC8FC\uAC04',
        total: '\uCD1D\uACC4',
        date: '\uB0A0\uC9DC',
        asset: '\uC790\uC0B0',
        strategy: '\uC804\uB7B5',
        session: '\uC138\uC158',
        outcome: '\uACB0\uACFC',
        amount: '\uAE08\uC561',
        tradeReflections: '\uAC70\uB798 \uC131\uCC30\uACFC \uAD50\uD6C8',
        trade: '\uAC70\uB798',
        winRate: '\uC2B9\uB960',
        page: '\uD398\uC774\uC9C0'
    }
};
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

// Updated PDF Download Function with Unicode Support
const downloadMonthlyReport = async () => {
    setDownloadingPDF(true);
    
    try {
        // Get translations for selected language
        const t = translations[selectedLanguage];
        
        // Add company report title translations
        const companyTitleTranslations = {
            english: 'SnowAI Company Report',
            chinese: 'SnowAI 公司报告',
            korean: 'SnowAI 회사 보고서'
        };
        
        // Add professional credentials translations
        const credentialsTranslations = {
            english: {
                trader: 'Professional Trader',
                researcher: 'Quantitative Researcher/Investor'
            },
            chinese: {
                trader: '专业交易员',
                researcher: '量化研究员/投资者'
            },
            korean: {
                trader: '전문 트레이더',
                researcher: '퀀트 연구원/투자자'
            }
        };
        
        // Get flag image based on language
        const getFlagImage = () => {
            switch(selectedLanguage) {
                case 'chinese': return chinese_flag;
                case 'korean': return korean_flag;
                case 'english': 
                default: return us_flag;
            }
        };
        
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
        
        // Unicode text helper function
        const addUnicodeText = async (text, x, y, options = {}) => {
            if (selectedLanguage === 'chinese' || selectedLanguage === 'korean') {
                try {
                    // Create canvas for rendering CJK text
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const fontSize = options.fontSize || 12;
                    const color = options.color || 'black';
                    
                    // Set up font with fallbacks
                    const fontFamily = selectedLanguage === 'chinese' 
                        ? `${fontSize}px "Noto Sans SC", "Microsoft YaHei", "SimSun", Arial, sans-serif`
                        : `${fontSize}px "Noto Sans KR", "Malgun Gothic", "Dotum", Arial, sans-serif`;
                    
                    ctx.font = fontFamily;
                    ctx.fillStyle = color;
                    ctx.textBaseline = 'top';
                    
                    const metrics = ctx.measureText(text);
                    const textWidth = Math.max(metrics.width + 4, 10);
                    const textHeight = fontSize * 1.2 + 4;
                    
                    canvas.width = textWidth;
                    canvas.height = textHeight;
                    
                    // Re-apply styles after canvas resize
                    ctx.font = fontFamily;
                    ctx.fillStyle = color;
                    ctx.textBaseline = 'top';
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.fillText(text, 2, 2);
                    
                    const imgData = canvas.toDataURL('image/png');
                    const scale = 0.35; // Scale down the image
                    pdf.addImage(imgData, 'PNG', x, y - fontSize * 0.8, textWidth * scale, textHeight * scale);
                    
                    return textWidth * scale; // Return width for positioning
                } catch (error) {
                    console.warn('Unicode rendering failed, using fallback:', error);
                    // Fallback to regular text
                    pdf.text(text, x, y);
                    return pdf.getTextWidth(text);
                }
            } else {
                // Use normal PDF text for English
                if (options.fontSize) pdf.setFontSize(options.fontSize);
                if (options.color) {
                    const colorMap = {
                        'blue': [0, 124, 186],
                        'green': [21, 128, 61],
                        'red': [185, 28, 28],
                        'black': [0, 0, 0],
                        'gray': [100, 100, 100]
                    };
                    if (colorMap[options.color]) {
                        pdf.setTextColor(...colorMap[options.color]);
                    }
                }
                pdf.text(text, x, y);
                return pdf.getTextWidth(text);
            }
        };
        
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
        const addSectionHeader = async (title, size = 14) => {
            checkNewPage(20);
            await addUnicodeText(title, margin, yPosition, { fontSize: size, color: 'blue' });
            yPosition += size === 14 ? 12 : 8;
        };
        
        // CREATE COVER PAGE WITH LARGE SNOWAI LOGO AND PERSONAL INFO
        try {
            // Add SnowAI Company Report title at the top - now translated
            const companyTitle = companyTitleTranslations[selectedLanguage];
            await addUnicodeText(companyTitle, (pageWidth - pdf.getTextWidth(companyTitle)) / 2, yPosition + 15, { fontSize: 24, color: 'blue' });
            yPosition += 30;
            
            // Add flag to top right corner
            try {
                const flagCanvas = document.createElement('canvas');
                const flagCtx = flagCanvas.getContext('2d');
                const flagImg = new Image();
                
                const flagPromise = new Promise((resolve) => {
                    flagImg.onload = () => {
                        flagCanvas.width = flagImg.width;
                        flagCanvas.height = flagImg.height;
                        flagCtx.drawImage(flagImg, 0, 0);
                        resolve(flagCanvas.toDataURL('image/png'));
                    };
                    flagImg.onerror = () => {
                        console.warn('Flag image could not be loaded');
                        resolve(null);
                    };
                    flagImg.src = getFlagImage();
                });
                
                const flagDataUrl = await flagPromise;
                
                if (flagDataUrl) {
                    const flagSize = 20;
                    const flagX = pageWidth - margin - flagSize;
                    const flagY = margin - 5; // Move flag up slightly to avoid title conflict
                    
                    pdf.addImage(flagDataUrl, 'PNG', flagX, flagY, flagSize, flagSize * 0.6);
                }
            } catch (flagError) {
                console.warn('Error adding flag:', flagError);
            }
            
            // Load and add SnowAI logo
            const logoCanvas = document.createElement('canvas');
            const logoCtx = logoCanvas.getContext('2d');
            const logoImg = new Image();
            
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
            
            // Add large SnowAI logo
            if (logoDataUrl) {
                const logoWidth = pageWidth - (margin * 2);
                const logoHeight = (pageHeight * 0.45);
                const logoX = margin;
                const logoY = yPosition + 10;
                
                pdf.addImage(logoDataUrl, 'PNG', logoX, logoY, logoWidth, logoHeight);
                yPosition = logoY + logoHeight + 20;
            } else {
                // If logo fails to load, add text placeholder
                await addUnicodeText('SnowAI', (pageWidth - pdf.getTextWidth('SnowAI')) / 2, yPosition + 80, { fontSize: 48, color: 'blue' });
                yPosition += 120;
            }
            
            // Add personal photo and info section
            const personalInfoY = yPosition;
            
            if (personalPhotoDataUrl) {
                const photoSize = 25;
                const photoX = margin;
                const photoY = personalInfoY;
                
                pdf.addImage(personalPhotoDataUrl, 'JPEG', photoX, photoY, photoSize, photoSize);
                
                // Add name next to the photo
                const traderName = 'Tlotlo Kutlwano Motingwe';
                await addUnicodeText(traderName, photoX + photoSize + 10, photoY + 8, { fontSize: 16, color: 'blue' });
                
                // Add multiple title/role lines below name - now translated
                const credentials = credentialsTranslations[selectedLanguage];
                await addUnicodeText(credentials.trader, photoX + photoSize + 10, photoY + 16, { fontSize: 12, color: 'gray' });
                await addUnicodeText(credentials.researcher, photoX + photoSize + 10, photoY + 24, { fontSize: 12, color: 'gray' });
                
                // Add contact info below roles
                await addUnicodeText('+27 84 731 6417', photoX + photoSize + 10, photoY + 32, { fontSize: 9, color: 'gray' });
                await addUnicodeText('butterrobot83@gmail.com', photoX + photoSize + 10, photoY + 38, { fontSize: 9, color: 'gray' });
                
                yPosition = photoY + 50;
                
            } else {
                // If personal photo fails, just add name and info
                const traderName = 'Tlotlo Kutlwano Motingwe';
                await addUnicodeText(traderName, margin, personalInfoY, { fontSize: 16, color: 'blue' });
                
                // Add translated credentials
                const credentials = credentialsTranslations[selectedLanguage];
                await addUnicodeText(credentials.trader, margin, personalInfoY + 10, { fontSize: 12, color: 'gray' });
                await addUnicodeText(credentials.researcher, margin, personalInfoY + 18, { fontSize: 12, color: 'gray' });
                
                await addUnicodeText('+27 84 731 6417', margin, personalInfoY + 28, { fontSize: 9, color: 'gray' });
                await addUnicodeText('butterrobot83@gmail.com', margin, personalInfoY + 36, { fontSize: 9, color: 'gray' });
                
                yPosition = personalInfoY + 50;
            }
            
            // Add page number
            await addUnicodeText(`${t.page} 1`, pageWidth - margin - 20, pageHeight - 10, { fontSize: 9 });
            
        } catch (logoError) {
            console.warn('Error adding cover page elements:', logoError);
            // Continue with basic cover page if there's an error
            const companyTitle = companyTitleTranslations[selectedLanguage];
            await addUnicodeText(companyTitle, (pageWidth - pdf.getTextWidth(companyTitle)) / 2, 40, { fontSize: 24, color: 'blue' });
        }
        
        // Start new page for content
        pdf.addPage();
        yPosition = margin;
        
        // Add report title at the top of page 2
        const title = t.comprehensiveReport;
        // Calculate proper width for centering
        let reportTitleWidth;
        if (selectedLanguage === 'chinese' || selectedLanguage === 'korean') {
            // Better estimate for CJK text - adjust multiplier
            reportTitleWidth = title.length * 7.5; // Reduced multiplier for 22px font
        } else {
            pdf.setFontSize(22); // Set font size first
            reportTitleWidth = pdf.getTextWidth(title);
        }
        await addUnicodeText(title, (pageWidth - reportTitleWidth) / 2, yPosition, { fontSize: 22, color: 'blue' });
        yPosition += 15;
        
        // Add subtitle (month/year)
        const subtitle = `${getMonthName(currentDate)}`;
        await addUnicodeText(subtitle, (pageWidth - pdf.getTextWidth(subtitle)) / 2, yPosition, { fontSize: 16, color: 'blue' });
        yPosition += 15;
        
        // Add account name below the date
        const accountText = `Account: ${accountName || 'N/A'}`;
        await addUnicodeText(accountText, (pageWidth - pdf.getTextWidth(accountText)) / 2, yPosition, { fontSize: 14 });
        yPosition += 20;
        
        // EXECUTIVE SUMMARY
        await addSectionHeader(t.executiveSummary);
        const analytics = calculateAnalytics();
        
        const summaryData = [
            [t.totalTrades, `${analytics.totalTrades}`],
            [t.winningTrades, `${analytics.totalWins} (${analytics.winRate.toFixed(1)}%)`],
            [t.losingTrades, `${analytics.totalLosses} (${(100 - analytics.winRate).toFixed(1)}%)`],
            [t.averageWin, `$${analytics.averageWin.toFixed(2)}`],
            [t.averageLoss, `$${analytics.averageLoss.toFixed(2)}`],
            [t.riskRewardRatio, `1:${analytics.averageWin > 0 ? (analytics.averageWin / analytics.averageLoss).toFixed(2) : '0'}`],
            [t.profitFactor, `${analytics.profitFactor === Infinity ? '∞' : analytics.profitFactor.toFixed(2)}`],
            [t.netPL, `$${analytics.netPnL.toFixed(2)}`],
            [t.largestWin, `$${Math.max(...getCurrentMonthTrades().map(tr => tr.amount)).toFixed(2)}`],
            [t.largestLoss, `$${Math.min(...getCurrentMonthTrades().map(tr => tr.amount)).toFixed(2)}`]
        ];
        
        // Create two-column summary
        const midPoint = Math.ceil(summaryData.length / 2);
        const leftColumn = summaryData.slice(0, midPoint);
        const rightColumn = summaryData.slice(midPoint);
        
        for (let index = 0; index < leftColumn.length; index++) {
            const [label, value] = leftColumn[index];
            await addUnicodeText(label + ':', margin, yPosition, { fontSize: 10 });
            await addUnicodeText(value, margin + 50, yPosition, { fontSize: 10 });
            
            // Add right column data if available
            if (rightColumn[index]) {
                const [rightLabel, rightValue] = rightColumn[index];
                await addUnicodeText(rightLabel + ':', margin + 100, yPosition, { fontSize: 10 });
                await addUnicodeText(rightValue, margin + 150, yPosition, { fontSize: 10 });
            }
            yPosition += 6;
        }
        
        yPosition += 10;
        
        // PERFORMANCE ANALYSIS BY GROUPS
        await addSectionHeader(t.performanceAnalysis);
        
        // Day of Week Analysis
        await addSectionHeader(t.byDayOfWeek, 12);
        const dayMetrics = getChartMetrics('dayOfWeek');
        
        for (const [day, metrics] of Object.entries(dayMetrics)) {
            checkNewPage(8);
            const color = metrics.total >= 0 ? 'green' : 'red';
            await addUnicodeText(`${day}: $${metrics.total.toFixed(2)} (${metrics.trades} ${t.trades}, ${metrics.winRate}% ${t.winRate})`, margin, yPosition, { fontSize: 9, color });
            yPosition += 5;
        }
        
        yPosition += 5;
        
        // Trading Session Analysis
        await addSectionHeader(t.byTradingSession, 12);
        const sessionMetrics = getChartMetrics('session');
        
        for (const [session, metrics] of Object.entries(sessionMetrics)) {
            checkNewPage(8);
            const color = metrics.total >= 0 ? 'green' : 'red';
            await addUnicodeText(`${session}: $${metrics.total.toFixed(2)} (${metrics.trades} ${t.trades}, ${metrics.winRate}% ${t.winRate})`, margin, yPosition, { fontSize: 9, color });
            yPosition += 5;
        }
        
        yPosition += 5;
        
        // Strategy Analysis
        await addSectionHeader(t.byStrategy, 12);
        const strategyMetrics = getChartMetrics('strategy');
        
        for (const [strategy, metrics] of Object.entries(strategyMetrics)) {
            checkNewPage(8);
            const color = metrics.total >= 0 ? 'green' : 'red';
            await addUnicodeText(`${strategy}: $${metrics.total.toFixed(2)} (${metrics.trades} ${t.trades}, ${metrics.winRate}% ${t.winRate})`, margin, yPosition, { fontSize: 9, color });
            yPosition += 5;
        }
        
        yPosition += 5;
        
        // Asset Analysis
        await addSectionHeader(t.byAsset, 12);
        const assetMetrics = getChartMetrics('asset');
        
        for (const [asset, metrics] of Object.entries(assetMetrics)) {
            checkNewPage(8);
            const color = metrics.total >= 0 ? 'green' : 'red';
            await addUnicodeText(`${asset}: $${metrics.total.toFixed(2)} (${metrics.trades} ${t.trades}, ${metrics.winRate}% ${t.winRate})`, margin, yPosition, { fontSize: 9, color });
            yPosition += 5;
        }
        
        yPosition += 10;
        
        // ADDITIONAL INSIGHTS
        await addSectionHeader(t.tradingInsights);
        
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
            await addUnicodeText(`${t.bestTradingDay}: ${new Date(sortedDays[0][0]).toLocaleDateString()} ($${sortedDays[0][1].toFixed(2)})`, margin, yPosition, { fontSize: 10 });
            yPosition += 6;
            
            if (sortedDays.length > 1) {
                const worstDay = sortedDays[sortedDays.length - 1];
                await addUnicodeText(`${t.worstTradingDay}: ${new Date(worstDay[0]).toLocaleDateString()} ($${worstDay[1].toFixed(2)})`, margin, yPosition, { fontSize: 10 });
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
        await addUnicodeText(`${t.longestWinningStreak}: ${maxWinStreak} ${t.trades}`, margin, yPosition, { fontSize: 10 });
        yPosition += 6;
        await addUnicodeText(`${t.longestLosingStreak}: ${maxLossStreak} ${t.trades}`, margin, yPosition, { fontSize: 10 });
        yPosition += 10;
        
        // Capture and add charts if analytics are shown
        if (showAnalytics) {
            await addSectionHeader(t.visualAnalysis);
            
            const chartElements = [
                { selector: '[data-chart="dayOfWeek"]', title: t.performanceByDayOfWeek },
                { selector: '[data-chart="session"]', title: t.performanceByTradingSession },
                { selector: '[data-chart="strategy"]', title: t.performanceByStrategy },
                { selector: '[data-chart="asset"]', title: t.performanceByAsset },
                { selector: '[data-chart="equity"]', title: t.equityCurve }
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
                        await addUnicodeText(title, margin, yPosition, { fontSize: 12, color: 'blue' });
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
        
        await addSectionHeader(t.detailedTradeLog);
        
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
            
            for (const weekStart of sortedWeeks) {
                const weekTrades = weeklyTrades[weekStart];
                const weekTotal = weekTrades.reduce((sum, trade) => sum + trade.amount, 0);
                
                checkNewPage(20);
                
                // Week header
                const weekStartDate = new Date(weekStart);
                const weekEndDate = new Date(weekStart);
                weekEndDate.setDate(weekStartDate.getDate() + 6);
                
                await addUnicodeText(
                    `${t.weekOf} ${weekStartDate.toLocaleDateString()} - ${weekEndDate.toLocaleDateString()} | ` +
                    `${t.total}: $${weekTotal.toFixed(2)} | ${t.trades}: ${weekTrades.length}`,
                    margin, yPosition, { fontSize: 11, color: 'blue' }
                );
                yPosition += 8;
                
                // Table headers
                const headers = [t.date, t.asset, t.strategy, t.session, t.outcome, t.amount];
                const colWidths = [20, 25, 30, 25, 20, 20];
                let xPos = margin;
                
                // Draw headers
                for (let i = 0; i < headers.length; i++) {
                    await addUnicodeText(headers[i], xPos, yPosition, { fontSize: 8 });
                    xPos += colWidths[i];
                }
                yPosition += 6;
                
                // Draw line under headers (move up slightly to not cover first trade)
                pdf.line(margin, yPosition - 4, pageWidth - margin, yPosition - 4);
                yPosition += 2;
                
                // Add trade rows for this week
                for (const trade of weekTrades) {
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
                    const color = trade.amount > 0 ? 'green' : trade.amount < 0 ? 'red' : 'black';
                    
                    for (let i = 0; i < rowData.length; i++) {
                        const data = rowData[i];
                        const truncatedData = data.length > 12 ? data.substring(0, 10) + '..' : data;
                        await addUnicodeText(truncatedData, xPos, yPosition, { fontSize: 8, color });
                        xPos += colWidths[i];
                    }
                    yPosition += 5;
                }
                
                yPosition += 5; // Space between weeks
            }
        } else {
            await addUnicodeText('No trades found for this month.', margin, yPosition, { fontSize: 10 });
        }
        
        // REFLECTION SECTION (if reflections exist)
        const tradesWithReflections = monthTrades.filter(trade => trade.reflection && trade.reflection.trim());
        if (tradesWithReflections.length > 0) {
            pdf.addPage();
            yPosition = margin;
            
            await addSectionHeader(t.tradeReflections);
            
            for (let index = 0; index < tradesWithReflections.length; index++) {
                const trade = tradesWithReflections[index];
                checkNewPage(25);
                
                await addUnicodeText(`${t.trade} ${index + 1}: ${trade.asset} - ${new Date(trade.date_entered).toLocaleDateString()}`, margin, yPosition, { fontSize: 9, color: 'blue' });
                yPosition += 6;
                
                const reflection = trade.reflection;
                const lines = pdf.splitTextToSize(reflection, pageWidth - 2 * margin);
                
                for (const line of lines) {
                    checkNewPage(6);
                    await addUnicodeText(line, margin, yPosition, { fontSize: 9 });
                    yPosition += 5;
                }
                
                yPosition += 3;
            }
        }
        
        // Save the PDF
        const fileName = `${t.comprehensiveReport.replace(/\s+/g, '_')}_${getMonthName(currentDate).replace(' ', '_')}.pdf`;
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

    
    useEffect(() => {
    const handleClickOutside = (event) => {
        if (showLanguageSelector && !event.target.closest('.language-selector')) {
            setShowLanguageSelector(false);
        }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
}, [showLanguageSelector]);

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

//     useEffect(() => {
//     const handleClickOutside = (event) => {
//         if (showLanguageSelector && !event.target.closest('.language-selector')) {
//             setShowLanguageSelector(false);
//         }
//     };
    
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
// }, [showLanguageSelector]);

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

                    {/* Add this new button after your existing buttons */}
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <button 
                            onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                            style={{
                                background: '#6366f1',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Language: {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}
                        </button>
                        
                        {showLanguageSelector && (
                            <div className="language-selector" style={{
                                position: 'absolute',
                                top: '100%',
                                left: '0',
                                background: 'white',
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                zIndex: 1000,
                                minWidth: '120px'
                            }}>
                                {['english', 'chinese', 'korean'].map(lang => (
                                    <div
                                        key={lang}
                                        onClick={() => {
                                            setSelectedLanguage(lang);
                                            setShowLanguageSelector(false);
                                        }}
                                        style={{
                                            padding: '10px 15px',
                                            cursor: 'pointer',
                                            borderBottom: lang !== 'korean' ? '1px solid #eee' : 'none'
                                        }}
                                        onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                                        onMouseLeave={(e) => e.target.style.background = 'white'}
                                    >
                                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                    </div>
                                ))}
                            </div>
                        )}
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