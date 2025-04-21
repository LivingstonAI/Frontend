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
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Blockly from 'blockly';
import 'blockly/python';


function App() {
  const [assets, setAssets] = useState([]);

  return (

    <AudioProvider>
    <Router>
    <div>

      

        {/* Define Routes */}
      {/* <li><Link to="/tell_us_more">Tell us more</Link></li> */}
      <Routes>
        <Route path='/' element={<SnowAILandingPage />}></Route>
        {/* <Route path="/" element={<LandingPage />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tell_us_more" element={<TellUsMore />} />
        <Route path="/all_trades" element={<AllTrades />} />
        <Route path="/update_news" element={<UpdateNews />} />
        <Route path="/enter_new_trade" element={<EnterNewTrade />} />
        <Route path="/full_trade" element={<FullTrade />} />
        <Route path="/trading_history_analytics" element={<TradingHistory />} />
        {/* <Route path="/overview" element={<OverView />} /> */}
        {/* <Route path="/trading_history_analytics" element={<TradingHistory />} />
        <Route path="/trading_history_analytics/seven_days" element={<TradingHistorySevenDays />} />
        <Route path="/trading_history_analytics/one_month" element={<TradingHistoryOneMonth />} />
        <Route path="/trading_history_analytics/three_months" element={<TradingThreeMonths />} /> */}
        <Route path="/full_trade/:tradeId" element={<FullTrade />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/all_journals" element={<AllJournals />} />
        <Route path="/full_journal/:journalId" element={<ViewJournal />} />
        <Route path="/major_news" element={<MajorNews />} />
        <Route path="/conversation/:conversationID" element={<ChatBotInterface />} />
        <Route path="/assets" element={<AssetsTraded />} />
        <Route path="/personal_info" element={<ModifyPersonalInfo selectedAssets={assets} />} />
        <Route path="/models" element={<Models />} />
        <Route path='/market_makers' element={<MarketMakers/>} />
        <Route path='/risk_bot' element={<RiskBot />}></Route>
        <Route path='/photo' element={<Photo />}></Route>
        <Route path='/scratch' element={<ScratchInterFace />}></Route>
        <Route path='/model_performance' element={<ModelPerformance />}></Route>
        <Route path='/alert_bot' element={<AlertBot />}></Route>
        <Route path='/daily_brief' element={<DailyBrief />}></Route>
        <Route path='/performance_review/:asset' element={<PerformanceReview />}></Route>
        <Route path='/chill' element={<Chill />}></Route>
        <Route path='/account_analytics' element={<AccountAnalytics />}></Route>
        <Route path='/enter_new_trade_info' element={<EnterNewTradeInfo />}></Route>
        <Route path='/quizifier' element={<Quizzifier />}></Route>
        <Route path='/saved_quizzes' element={<SavedQuizzes />}></Route>
        {/* <Route path='/time' element={<Time />}></Route> */}
        <Route path='/tradergpt_analysis' element={<TraderGPTAnalysis />}></Route>
        <Route path='/backtested_results' element={<BacktestedResults />}></Route>
        <Route path='/ideas_section' element={<IdeasSection />}></Route>
        <Route path='/call_ai' element={<CallAI />}></Route>
        <Route path='/trade_ideas' element={<TradeIdeas />}></Route>
        <Route path='/prop_firm_management' element={<PropFirmManagement />}></Route>













        
        <Route path='/legodi' element={<Legodi />}></Route>
        <Route path='/order_tab' element={<OrderTab />}></Route>
        {/* <Route path='/map' element={<GeofenceMap />}></Route> */}
        <Route path='/regr' element={<LegodiRegistration />}></Route>
        <Route path='/legodi-login' element={<LegodiLogin />}></Route>



        <Route path='/zhenya' element={<Zhenya />}></Route>
        <Route path='/sections' element={<Sections />}></Route>
        <Route path='/sections/ww2' element={<WW2 />}></Route>
        <Route path='/sections/ww1' element={<WW1 />}></Route>
        <Route path='/sections/holocaust' element={<Holocaust />}></Route>
        <Route path='/sections/stalin_soviet_union' element={<StalinistSovietUnion />}></Route>


        <Route path='/michelle' element={<Michelle />}></Route>
        <Route path='/floating_flowers' element={<FloatingFlowers />}></Route>
        <Route path="/poetry_collection" element={<PoetryCollection />} />



        {/* <Route path="/payment" element={<Payment />} /> */}
        <Route path="*" element={<h1>404: page not found</h1>} />


    </Routes>

    </div>
      
    </Router>
    </AudioProvider>
  );
}

export default App;

