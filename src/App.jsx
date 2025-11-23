// import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Register from './components/register';
import Login from './components/login';
import TellUsMore from './components/tell_us';
import AllTrades from './components/all_trades';
import EnterNewTrade from './components/enter_new_trade';
import FullTrade from './components/full_trade';
import TradingHistory from './components/trading_history';
// import OverView from './components/overview';
// import TradingHistorySevenDays from './components/overview_seven_days';
// import TradingHistoryOneMonth from './components/overview_one_month';
// import TradingThreeMonths from './components/overview_three_months';
import Journal from './components/journal';
import AllJournals from './components/all_journals';
import ViewJournal from './components/view_journal';
import MajorNews from './components/major_news';
import ChatBotInterface from './components/livingston';
// import Payment from './components/payment';
import LandingPage from './components/landing_page';
import ModifyPersonalInfo from './components/personal_info';
import AssetsTraded from './components/assets';
import Models from './components/models';
import UpdateNews from './components/update_news';
import MarketMakers from './components/quant_analysis';
import RiskBot from './components/risk_bot';
import Photo from './components/photo';
import ScratchInterFace from './components/scratch';
import ModelPerformance from './components/model_performance';
import DailyBrief from './components/daily_brief';
import PerformanceReview from './components/performance_review';
import Chill from './components/chill';
import AlertBot from './components/alert_bot';
import SnowAILandingPage from './components/snowai_lp';
import AccountAnalytics from './components/account_analytics.jsx';
import EnterNewTradeInfo from './components/new_trade_info.jsx';
import { AudioProvider } from './components/audio_context.jsx';
import Quizzifier from './components/quizzifier.jsx';
// import Time from './components/time.jsx';
import TraderGPTAnalysis from './components/tradergpt.jsx';
import BacktestedResults from './components/backtesting_interface.jsx';
import IdeasSection from './components/ideas.jsx';
import SavedQuizzes from './components/saved_quizzes.jsx';
import CallAI from './components/call.jsx';
import TradeIdeas from './components/trade_ideas.jsx';
import PropFirmManagement from './components/prop_firm_management.jsx';
import Art from './components/art.jsx';
import Calendar from './components/calendar.jsx';
import CalendarData from './components/calendar_metrics.jsx';
import EconExplainer from './components/econ_explainer.jsx';
import Equations from './components/equations.jsx';
import ForexFactoryCapturer from './components/forex_factory.jsx';
import TradingEconDashboard from './components/trading_econ_dashboard.jsx';
import MarketShareInfographic from './components/tech_company_comparison.jsx';
import GoogleCalendar from './components/google_calendar.jsx';
import PaperGPT from './components/paper_gpt.jsx';
import ProcessChecker from './components/process_checker.jsx';
import ScientificPlayground from './components/car.jsx';
import EconomicsGPT from './components/economics_gpt.jsx';
import AICouncil from './components/ai_council.jsx';
import AICouncilConvos from './components/ai_council_convos.jsx';
import Compliance from './components/compliance.jsx';
import EconomicStrengthIndex from './components/esi.jsx';
import HolographicHUD from './components/snowbrain.jsx';
import ResearchLogbook from './components/research_logbook.jsx';
import SnowAICentralHub from './components/central_hub.jsx';
import SnowAIEarth from './components/snowai_earth.jsx';
import Diagnostics from './components/diagnostics.jsx';
import VideoTranscription from './components/video_transcription.jsx';
import BoardofGovernors from './components/governors.jsx';
import Charts from './components/charts.jsx';
import AssetCorrelation from './components/correlation.jsx';
import MarketStabilityScore from './components/market_stability.jsx';
import BlackHole from './components/black_hole.jsx';
import SNOWXDashboard from './components/snowx.jsx';
import HedgeFundTracker from './components/hedge_funds.jsx';
import ProbabilityEngine from './components/prob_engine.jsx';
import SnowAIBrowser from './components/browser.jsx';
import MultiAccountAnalytics from './components/multi_account.jsx';
import SnowAIVideos from './components/videos.jsx';
import SnowAIStockScreener from './components/stocks.jsx';
import MLPlayground from './components/ai_research';

import Zhenya from './components/zhenya';
import Sections from './components/sections';
import WW2 from './components/ww2';
import WW1 from './components/ww1';
import Holocaust from './components/holocaust';
import StalinistSovietUnion from './components/stalin_soviet_union';

import Michelle from './components/michelle';
import FloatingFlowers from './components/floating_flowers';
import PoetryCollection from './components/poetry_collection';

import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

import Legodi from './components/legodi';
import OrderTab from './components/order_tab';
// import GeofenceMap from './components/map';
import LegodiRegistration from './components/legodi_registration';
import LegodiLogin from './components/legodi_login';
import {BrowserRouter as Router, Route, Routes, useNavigate, useLocation} from 'react-router-dom';
import Blockly from 'blockly';
import 'blockly/python';
import Cookies from 'js-cookie'; // npm install js-cookie

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const accountName = Cookies.get('account_name');
    
    if (!accountName) {
      console.error('Account name not found');
      navigate('/login', { 
        state: { from: location.pathname } // Remember where they were trying to go
      });
    }
  }, [navigate, location]);

  const accountName = Cookies.get('account_name');
  
  if (!accountName) {
    return null; // Or a loading spinner while redirecting
  }

  return children;
};

function App() {
  const [assets, setAssets] = useState([]);

  return (
    <AudioProvider>
      <Router>
        <div>
          <Routes>
            {/* Public routes - no authentication required */}
            <Route path='/' element={<SnowAILandingPage />} />
            <Route path="/login" element={<Login />} />
            
            
            {/* Protected routes - authentication required */}
            <Route path="/tell_us_more" element={
              <ProtectedRoute>
                <TellUsMore />
              </ProtectedRoute>
            } />
            
            <Route path="/all_trades" element={
              <ProtectedRoute>
                <AllTrades />
              </ProtectedRoute>
            } />
            
            <Route path="/update_news" element={
              <ProtectedRoute>
                <UpdateNews />
              </ProtectedRoute>
            } />
            
            <Route path="/enter_new_trade" element={
              <ProtectedRoute>
                <EnterNewTrade />
              </ProtectedRoute>
            } />
            
            <Route path="/full_trade" element={
              <ProtectedRoute>
                <FullTrade />
              </ProtectedRoute>
            } />
            
            <Route path="/trading_history_analytics" element={
              <ProtectedRoute>
                <TradingHistory />
              </ProtectedRoute>
            } />
            
            <Route path="/full_trade/:tradeId" element={
              <ProtectedRoute>
                <FullTrade />
              </ProtectedRoute>
            } />
            
            <Route path="/journal" element={
              <ProtectedRoute>
                <Journal />
              </ProtectedRoute>
            } />
            
            <Route path="/all_journals" element={
              <ProtectedRoute>
                <AllJournals />
              </ProtectedRoute>
            } />
            
            <Route path="/full_journal/:journalId" element={
              <ProtectedRoute>
                <ViewJournal />
              </ProtectedRoute>
            } />
            
            <Route path="/major_news" element={
              <ProtectedRoute>
                <MajorNews />
              </ProtectedRoute>
            } />
            
            <Route path="/conversation/:conversationID" element={
              <ProtectedRoute>
                <ChatBotInterface />
              </ProtectedRoute>
            } />
            
            <Route path="/assets" element={
              <ProtectedRoute>
                <AssetsTraded />
              </ProtectedRoute>
            } />
            
            <Route path="/personal_info" element={
              <ProtectedRoute>
                <ModifyPersonalInfo selectedAssets={assets} />
              </ProtectedRoute>
            } />
            
            <Route path="/models" element={
              <ProtectedRoute>
                <Models />
              </ProtectedRoute>
            } />
            
            <Route path='/market_makers' element={
              <ProtectedRoute>
                <MarketMakers/>
              </ProtectedRoute>
            } />
            
            <Route path='/risk_bot' element={
              <ProtectedRoute>
                <RiskBot />
              </ProtectedRoute>
            } />
            
            <Route path='/photo' element={
              <ProtectedRoute>
                <Photo />
              </ProtectedRoute>
            } />
            
            <Route path='/scratch' element={
              <ProtectedRoute>
                <ScratchInterFace />
              </ProtectedRoute>
            } />
            
            <Route path='/model_performance' element={
              <ProtectedRoute>
                <ModelPerformance />
              </ProtectedRoute>
            } />
            
            <Route path='/alert_bot' element={
              <ProtectedRoute>
                <AlertBot />
              </ProtectedRoute>
            } />
            
            <Route path='/daily_brief' element={
              <ProtectedRoute>
                <DailyBrief />
              </ProtectedRoute>
            } />
            
            <Route path='/performance_review/:asset' element={
              <ProtectedRoute>
                <PerformanceReview />
              </ProtectedRoute>
            } />
            
            <Route path='/chill' element={
              <ProtectedRoute>
                <Chill />
              </ProtectedRoute>
            } />
            
            <Route path='/account_analytics' element={
              <ProtectedRoute>
                <AccountAnalytics />
              </ProtectedRoute>
            } />

            
            <Route path='/multiple_account_analytics' element={
              <ProtectedRoute>
                <MultiAccountAnalytics />
              </ProtectedRoute>
            } />
            
            <Route path='/enter_new_trade_info' element={
              <ProtectedRoute>
                <EnterNewTradeInfo />
              </ProtectedRoute>
            } />
            
            <Route path='/quizifier' element={
              <ProtectedRoute>
                <Quizzifier />
              </ProtectedRoute>
            } />
            
            <Route path='/saved_quizzes' element={
              <ProtectedRoute>
                <SavedQuizzes />
              </ProtectedRoute>
            } />
            
            <Route path='/tradergpt_analysis' element={
              <ProtectedRoute>
                <TraderGPTAnalysis />
              </ProtectedRoute>
            } />
            
            <Route path='/backtested_results' element={
              <ProtectedRoute>
                <BacktestedResults />
              </ProtectedRoute>
            } />
            
            <Route path='/ideas_section' element={
              <ProtectedRoute>
                <IdeasSection />
              </ProtectedRoute>
            } />
            
            <Route path='/call_ai' element={
              <ProtectedRoute>
                <CallAI />
              </ProtectedRoute>
            } />
            
            <Route path='/trade_ideas' element={
              <ProtectedRoute>
                <TradeIdeas />
              </ProtectedRoute>
            } />
            
            <Route path='/prop_firm_management' element={
              <ProtectedRoute>
                <PropFirmManagement />
              </ProtectedRoute>
            } />
            
            <Route path='/music' element={
              <ProtectedRoute>
                <Art />
              </ProtectedRoute>
            } />
            
            <Route path='/calendar' element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            } />
            
            <Route path='/calendar_data' element={
              <ProtectedRoute>
                <CalendarData />
              </ProtectedRoute>
            } />
            
            <Route path='/econ_explainer' element={
              <ProtectedRoute>
                <EconExplainer />
              </ProtectedRoute>
            } />
            
            <Route path='/equations' element={
              <ProtectedRoute>
                <Equations />
              </ProtectedRoute>
            } />
            
            <Route path='/forex_factory' element={
              <ProtectedRoute>
                <ForexFactoryCapturer />
              </ProtectedRoute>
            } />
            
            <Route path='/trading_econ_dashboard' element={
              <ProtectedRoute>
                <TradingEconDashboard />
              </ProtectedRoute>
            } />
            
            <Route path='/trading_calendar' element={
              <ProtectedRoute>
                <GoogleCalendar />
              </ProtectedRoute>
            } />
            
            <Route path='/paper_gpt' element={
              <ProtectedRoute>
                <PaperGPT />
              </ProtectedRoute>
            } />
            
            <Route path='/process_checker' element={
              <ProtectedRoute>
                <ProcessChecker />
              </ProtectedRoute>
            } />
            
            <Route path='/science_playground' element={
              <ProtectedRoute>
                <ScientificPlayground />
              </ProtectedRoute>
            } />
            
            <Route path='/economics_gpt' element={
              <ProtectedRoute>
                <EconomicsGPT />
              </ProtectedRoute>
            } />
            
            <Route path='/ai_council' element={
              <ProtectedRoute>
                <AICouncil />
              </ProtectedRoute>
            } />
            
            <Route path='/ai_council_conversations' element={
              <ProtectedRoute>
                <AICouncilConvos />
              </ProtectedRoute>
            } />
            
            <Route path='/firm_compliance' element={
              <ProtectedRoute>
                <Compliance />
              </ProtectedRoute>
            } />

            <Route path='/esi' element={
              <ProtectedRoute>
                <EconomicStrengthIndex />
              </ProtectedRoute>
            } />

            <Route path='/research_logbook' element={
              <ProtectedRoute>
                <ResearchLogbook />
              </ProtectedRoute>
            } />

            <Route path='/snowai_central_hub' element={
              <ProtectedRoute>
                <SnowAICentralHub />
              </ProtectedRoute>
            } />

            
            <Route path='/snowai_earth' element={
              <ProtectedRoute>
                <SnowAIEarth />
              </ProtectedRoute>
            } />

            <Route path='/diagnostics' element={
              <ProtectedRoute>
                <Diagnostics />
              </ProtectedRoute>
            } />

            <Route path='/video_transcription' element={
              <ProtectedRoute>
                <VideoTranscription />
              </ProtectedRoute>
            } />

            

            <Route path='/board_of_governors' element={
              <ProtectedRoute>
                <BoardofGovernors />
              </ProtectedRoute>
            } />

            <Route path='/charts' element={
              <ProtectedRoute>
                <Charts />
              </ProtectedRoute>
            } />

            <Route path='/asset_correlation' element={
              <ProtectedRoute>
                <AssetCorrelation />
              </ProtectedRoute>
            } />

            <Route path='/market_stability_score' element={
              <ProtectedRoute>
                <MarketStabilityScore />
              </ProtectedRoute>
            } />
            
            <Route path='/black_hole' element={
              <ProtectedRoute>
                <BlackHole />
              </ProtectedRoute>
            } />

            <Route path='/snowx' element={
              <ProtectedRoute>
                <SNOWXDashboard />
              </ProtectedRoute>
            } />

            <Route path='/hedge_fund_tracker' element={
              <ProtectedRoute>
                <HedgeFundTracker />
              </ProtectedRoute>
            } />

            <Route path='/prob_engine' element={
              <ProtectedRoute>
                <ProbabilityEngine />
              </ProtectedRoute>
            } />

            <Route path='/browser' element={
              <ProtectedRoute>
                <SnowAIBrowser />
              </ProtectedRoute>
            } />

            <Route path='/videos' element={
              <ProtectedRoute>
                <SnowAIVideos />
              </ProtectedRoute>
            } />

            <Route path='/stock_screener' element={
              <ProtectedRoute>
                <SnowAIStockScreener />
              </ProtectedRoute>
            } />

            <Route path='/ml_playground' element={
              <ProtectedRoute>
                <MLPlayground />
              </ProtectedRoute>
            } />
            













            <Route path='/market_share_infographic' element={
              <ProtectedRoute>
                <MarketShareInfographic />
              </ProtectedRoute>
            } />
            
            <Route path='/legodi' element={
              <ProtectedRoute>
                <Legodi />
              </ProtectedRoute>
            } />
            
            <Route path='/order_tab' element={
              <ProtectedRoute>
                <OrderTab />
              </ProtectedRoute>
            } />
            
            <Route path='/regr' element={
              <ProtectedRoute>
                <LegodiRegistration />
              </ProtectedRoute>
            } />
            
            <Route path='/legodi-login' element={
              <ProtectedRoute>
                <LegodiLogin />
              </ProtectedRoute>
            } />
            
            <Route path='/zhenya' element={
              <ProtectedRoute>
                <Zhenya />
              </ProtectedRoute>
            } />
            
            <Route path='/sections' element={
              <ProtectedRoute>
                <Sections />
              </ProtectedRoute>
            } />
            
            <Route path='/sections/ww2' element={
              <ProtectedRoute>
                <WW2 />
              </ProtectedRoute>
            } />
            
            <Route path='/sections/ww1' element={
              <ProtectedRoute>
                <WW1 />
              </ProtectedRoute>
            } />
            
            <Route path='/sections/holocaust' element={
              <ProtectedRoute>
                <Holocaust />
              </ProtectedRoute>
            } />
            
            <Route path='/sections/stalin_soviet_union' element={
              <ProtectedRoute>
                <StalinistSovietUnion />
              </ProtectedRoute>
            } />
            
            <Route path='/michelle' element={
              <ProtectedRoute>
                <Michelle />
              </ProtectedRoute>
            } />
            
            <Route path='/floating_flowers' element={
              <ProtectedRoute>
                <FloatingFlowers />
              </ProtectedRoute>
            } />
            
            <Route path="/poetry_collection" element={
              <ProtectedRoute>
                <PoetryCollection />
              </ProtectedRoute>
            } />

            {/* 404 route */}
            <Route path="*" element={<h1>404: page not found</h1>} />
          </Routes>
        </div>
      </Router>
    </AudioProvider>
  );
}

export default App;