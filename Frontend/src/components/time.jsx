import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import TradingDashboard from "./trading_dashboard";

export default function Time() {

    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    const accountName = Cookies.get('account_name');

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">Trading Data Analytics</h5>
                    <TradingDashboard />

                    <br />
                    
                    </div>
                    </div>
                </div>
    );
}



// react jsx code:

// import React, { useEffect, useState } from "react";
// import Header from "./header";
// import SideNavs from "./side_navs";
// import Cookies from 'js-cookie';


// export default function Time() {

//     const baseUrl = 'https://backend-production-c0ab.up.railway.app';

//     const accountName = Cookies.get('account_name');

//     return (
//         <div>
//             <div className="header">
//                 <Header />
//             </div>
//             <div className="main-page-body">
//                 <SideNavs />
//                 <div className="main-body-info">
//                     <h5 className="major-upcoming-news-events-header">Trading Data Analytics</h5>
                   
//                     <br />
                    
//                     </div>
//                     </div>
//                 </div>
//     );
// }


// --------------------------------------------------------------------------

// views.py (you can deal with the calculations here)

// --------------------------------------------------------------------------

// urls.py (you can create)

// ------------------------------------------------------------------------

// models.py:

// class Account(models.Model):
//     account_name = models.CharField(max_length=100, unique=True)  # Unique account identifier
//     main_assets = models.CharField(max_length=255)  # Main asset classes, e.g., Forex, Equities
//     initial_capital = models.FloatField()  # Initial capital as a float

//     def __str__(self):
//         return self.account_name


// class AccountTrades(models.Model):
//     account = models.ForeignKey(
//         Account, related_name='trades', on_delete=models.CASCADE
//     )  # Link to Account
//     asset = models.CharField(max_length=100)  # Traded asset, e.g., EURUSD, XAUUSD
//     order_type = models.CharField(max_length=50)  # Type of order, e.g., Buy or Sell
//     strategy = models.CharField(max_length=100)  # Strategy used for the trade
//     day_of_week_entered = models.CharField(max_length=10)  # Day trade was entered, e.g., Monday
//     day_of_week_closed = models.CharField(max_length=10, blank=True, null=True)  # Day trade closed
//     trading_session_entered = models.CharField(max_length=50)  # Session entered, e.g., London, NY
//     trading_session_closed = models.CharField(max_length=50, blank=True, null=True)  # Session closed
//     outcome = models.CharField(max_length=10)  # Profit or Loss
//     amount = models.FloatField()  # Trade amount as a float, e.g., -100 or 150
//     emotional_bias = models.TextField(blank=True, null=True)  # Notes on emotional state (optional)
//     reflection = models.TextField(blank=True, null=True)  # Reflective notes (optional)
//     date_entered = models.DateTimeField(blank=True, null=True)  # New field for the date trade was entered

//     def __str__(self):
//         return f"{self.account.account_name} - {self.asset} ({self.order_type})"


// ------------------------------------------------------------------------

// Hey! So this may sound comp