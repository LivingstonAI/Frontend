import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import LiveClock from "./view_clock";

export default function MajorNews() {
    const [newsData, setNewsData] = useState({});
    const currencyArray = ['EUR', 'USD', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD', 'ZAR', 'CNY', 'SEK', 'NOK', 'SGD', 'HKD', 'KRW', 'TRY', 'INR', 'BRL', 'RUB', 'MXN', 'IDR', 'THB', 'MYR', 'PHP', 'PLN', 'TWD', 'SAR', 'AED', 'QAR', 'EGP', 'KWD', 'All'];
    
    // useEffect(() => {
    //     async function fetchUpcomingNews() {
    //         const userEmail = 'pythonappbrewery@gmail.com'; // Replace with the actual user's email
    //         try {
    //             const response = await fetch(`https://backend-production-c0ab.up.railway.app/upcoming_news/${userEmail}/`);
    //             const data = await response.json();
    //             console.log(data);
    //             setNewsData(data);
    //         } catch (error) {
    //             console.error('Error fetching upcoming news:', error);
    //         }
    //     }

    //     fetchUpcomingNews();
    // }, []);

    // const getCurrencyFromEvent = (event) => {
    //     const foundCurrency = currencyArray.find(currency => event.includes(currency));
    //     return foundCurrency || "-";
    // };

    //     const getData = (event) => {
        
    //     if (event.length === 7) {
    //         // remove element one
    //         event.splice(0, 1);
    //     }
    //     // event.splice(0, 1);
    //     // console.log(event);
    //     // console.log(event.length);
    //     const filteredData = event.map(item => {
    //         // Remove currency and numbers using regular expression
    //         const filteredItem = item.replace(':', '').replace('am', '').replace('pm', '').replace('Day', '').replace(/\d+/g, '').replace(/-+$/, '').replace(/[-%]+$/, '').replace(/[-.]/gi, '');
    //         return filteredItem;
    //     });

    //     const filteredDataWithoutEmpty = filteredData.filter(item => item !== '');

    //     for (let i = 0; i < filteredDataWithoutEmpty.length; i++) {
    //         if (currencyArray.includes(filteredDataWithoutEmpty[i])) {
    //             filteredDataWithoutEmpty.splice(i, 1); // remove the element at index i
    //         }
    //         }

    //     console.log(filteredDataWithoutEmpty);
    //     console.log(filteredDataWithoutEmpty.length);

    //     if (filteredDataWithoutEmpty.length === 3) {
    //         filteredDataWithoutEmpty.splice(1, 2)
    //     }
    //     return filteredDataWithoutEmpty;
    // }

    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <div className="journal-liveclock">
                        <LiveClock />
                    </div>
                    <h5 className="major-upcoming-news-events-header">Major Upcoming News Events:(forexfactory.com)</h5><br />
                    {/* I want to put the 'Impact'Legend here */}
                    <div className="impact-legend">
    <div className="legend-item">
        <div className="impact-indicator red-impact"></div>
        <span>High</span>
    </div>
    <div className="legend-item">
        <div className="impact-indicator orange-impact"></div>
        <span>Medium</span>
    </div>
    <div className="legend-item">
        <div className="impact-indicator yellow-impact"></div>
        <span>Low</span>
    </div>
</div>
< br />

                    <table className="news-event">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Currency</th>
                                <th>News Events</th>
                                <th>Impact</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* <tr>
                                <td>12:45am</td>
                                <td>NZD</td>
                                <td>Trade Balance</td>
                                <td><div className="yellow-impact"></div></td>
                            </tr>
                            <tr>
                                <td>1:00am</td>
                                <td>AUD</td>
                                <td>Flash Manufacturing PM</td>
                                <td><div className="yellow-impact"></div></td>
                            </tr>
                            <tr>
                                <td>1:00am</td>
                                <td>AUD</td>
                                <td>Flash Services PMI</td>
                                <td><div className="yellow-impact"></div></td>
                            </tr>
                            <tr>
                                <td>1:01am</td>
                                <td>GBP</td>
                                <td>GfK Consumer Confidence</td>
                                <td><div className="yellow-impact"></div></td>
                            </tr>
                            <tr>
                                <td>1:30am</td>
                                <td>JPY</td>
                                <td>National Core CPI y/y</td>
                                <td><div className="yellow-impact"></div></td>
                            </tr>

                            <tr>
                                <td>2:30am</td>
                                <td>JPY</td>
                                <td>Flash Manufacturing PMI</td>
                                <td><div className="yellow-impact"></div></td>
                            </tr>
                            <tr>
                                <td>Tentative</td>
                                <td>JPY</td>
                                <td>Monetary Policy Statement</td>
                                <td><div className="red-impact"></div></td>
                            </tr>

                            <tr>
                                <td>Tentative</td>
                                <td>JPY</td>
                                <td>BOJ Policy Rate</td>
                                <td><div className="orange-impact"></div></td>
                            </tr>
                         
                         
                            <tr>
                                <td>8:00am</td>
                                <td>GBP</td>
                                <td>Retail Sales m/m</td>
                                <td><div className="red-impact"></div></td>
                            </tr>
                            <tr>
                                <td>Tentative</td>
                                <td>JPY</td>
                                <td>BOJ Press Conference</td>
                                <td><div className="red-impact"></div></td>
                            </tr>
                            <tr>
                                <td>9:15am</td>
                                <td>EUR</td>
                                <td>French Flash Manufacturing PMI</td>
                                <td><div className="red-impact"></div></td>
                            </tr>
                            <tr>
                                <td>9:15am</td>
                                <td>EUR</td>
                                <td>French Flash Services PMI</td>
                                <td><div className="red-impact"></div></td>
                            </tr>
                            <tr>
                                <td>9:30am</td>
                                <td>EUR</td>
                                <td>German Flash Manufacturing PMI</td>
                                <td><div className="red-impact"></div></td>
                            </tr>
                            <tr>
                                <td>9:30am</td>
                                <td>EUR</td>
                                <td>German Flash Services PMI</td>
                                <td><div className="red-impact"></div></td>
                            </tr>
                            <tr>
                                <td>10:00am</td>
                                <td>EUR</td>
                                <td>Flash Manufacturing PMI</td>
                                <td><div className="orange-impact"></div></td>
                            </tr>
                            <tr>
                                <td>10:00am</td>
                                <td>GBP</td>
                                <td>Flash Services PMI</td>
                                <td><div className="orange-impact"></div></td>
                            </tr>
                            <tr>
                                <td>10:30am</td>
                                <td>GBP</td>
                                <td>Flash Manufacturing PMI</td>
                                <td><div className="red-impact"></div></td>
                            </tr>
                            <tr>
                                <td>10:30am</td>
                                <td>EUR</td>
                                <td>Flash Services PMI</td>
                                <td><div className="red-impact"></div></td>
                            </tr>
                            <tr>
                                <td>12:00pm</td>
                                <td>GBP</td>
                                <td>CBI Industrial Order Expectations</td>
                                <td><div className="yellow-impact"></div></td>
                            </tr>
                            <tr>
                                <td>2:30pm</td>
                                <td>CAD</td>
                                <td>Core Retail Sales m/m</td>
                                <td><div className="orange-impact"></div></td>
                            </tr>
                            <tr>
                                <td>2:30pm</td>
                                <td>CAD</td>
                                <td>Retail Sales m/m</td>
                                <td><div className="orange-impact"></div></td>
                            </tr>
                            {/* <tr>
                                <td>2:30pm</td>
                                <td>CAD</td>
                                <td>Foreign Securities Purchases</td>
                                <td><div className="-impact"></div></td>
                            </tr> */}
                            <tr>
                                <td>Tentative</td>
                                <td>GBP</td>
                                <td>10-y Bond Auction</td>
                                <td><div className="yellow-impact"></div></td>
                            </tr>
                            <tr>    
                                <td>3:00pm</td>
                                <td>CNY</td>
                                <td>CB Leading Index m/m</td>
                                <td><div className="yellow-impact"></div></td>
                            </tr>

                            <tr>
                                <td>3:00pm</td>
                                <td>USD</td>
                                <td>S&P/CS Composite-20 HPI y/y</td>
                                <td><div className="orange-impact"></div></td>
                            </tr>
                            <tr>
                                <td>3:00pm</td>
                                <td>USD</td>
                                <td>HPI m/m</td>
                                <td><div className="yellow-impact"></div></td>
                            </tr>
                            <tr>
                                <td>4:00pm</td>
                                <td>USD</td>
                                <td>CB Consumer Confidence</td>
                                <td><div className="red-impact"></div></td>
                            </tr>
                            <tr>
                                <td>4:00pm</td>
                                <td>USD</td>
                                <td>New Home Sales</td>
                                <td><div className="orange-impact"></div></td>
                            </tr>
                            <tr>
                                <td>4:00pm</td>
                                <td>USD</td>
                                <td>Richmond Manufacturing Index</td>
                                <td><div className="orange-impact"></div></td>
                            </tr>
                            <tr>
                                <td>7:30pm</td>
                                <td>USD</td>
                                <td>FOMC Member Bowman Speaks</td>
                                <td><div className="yellow-impact"></div></td>
                            </tr>
                            {/* {newsData &&
                                Object.keys(newsData).map((time, index) => {
                                    try {
                                        return (
                                            <React.Fragment key={index}>
                                                {newsData[time].map((event, eventIndex) => (
                                                    <tr key={eventIndex}>
                                                        <td>{time}</td>
                                                        <td>{getCurrencyFromEvent(event)}</td>
                                                        <td>{getData(event) || "-"}</td>
                                                        <td>{"-"}</td>
                                                    </tr>
                                                ))}
                                            </React.Fragment>
                                        );
                                    } catch (error) {
                                        console.error('Error rendering news event:', error);
                                        return null; // Skip rendering this item in case of an error
                                    }
                                })} */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
