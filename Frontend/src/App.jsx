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
import Legodi from './components/legodi';
import OrderTab from './components/order_tab';
// import GeofenceMap from './components/map';
import LegodiRegistration from './components/legodi_registration';
import LegodiLogin from './components/legodi_login';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { useState } from 'react';
import Blockly from 'blockly';
import 'blockly/python';


function App() {
  const [assets, setAssets] = useState([]);
  return (
    <Router>
    <div>
      {/* <li><Link to="/tell_us_more">Tell us more</Link></li> */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
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
        
        <Route path='/legodi' element={<Legodi />}></Route>
        <Route path='/order_tab' element={<OrderTab />}></Route>
        {/* <Route path='/map' element={<GeofenceMap />}></Route> */}
        <Route path='/regr' element={<LegodiRegistration />}></Route>
        <Route path='/legodi-login' element={<LegodiLogin />}></Route>
        {/* <Route path="/payment" element={<Payment />} /> */}
        <Route path="*" element={<h1>404: page not found</h1>} />
    </Routes>

    </div>
      
    </Router>
  );
}

export default App;

