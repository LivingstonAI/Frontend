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
                    <h5 className="major-upcoming-news-events-header">Major Upcoming News Events:(forexfactory.com)</h5>
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
                            <tr>
                                <td>12:45am</td>
                                <td>NZD</td>
                                <td>Visitor Arrivals m/m</td>
                                <td><div className="yellow-impact"></div></td>
                            </tr>
                            <tr>
                                <td>1:00am</td>
                                <td>GBP</td>
                                <td>MPC Member Mann Speaks</td>
                                <td><div className="yellow-impact"></div></td>
                            </tr>
                            <tr>
                                <td>2:30am</td>
                                <td>AUD</td>
                                <td>Westpac Consumer Sentiment</td>
                                <td><div className="yellow-impact"></div></td>
                            </tr>
                            <tr>
                                <td>3:30am</td>
                                <td>AUD</td>
                                <td>NAB Business Confidence</td>
                                <td><div className="orange-impact"></div></td>
                            </tr>
                            <tr>
                                <td>8:00am</td>
                                <td>EUR</td>
                                <td>German WPI m/m</td>
                                <td><div className="yellow-impact"></div></td>
                            </tr>
                            <tr>
                                <td>8:00am</td>
                                <td>GBP</td>
                                <td>Claimant Count Change</td>
                                <td><div className="red-impact"></div></td>
                            </tr>
                            <tr>
                                <td>8:00am</td>
                                <td>GBP</td>
                                <td>Average Earnings Index 3m/y</td>
                                <td><div className="orange-impact"></div></td>
                            </tr>
                            <tr>
                                <td>8:00am</td>
                                <td>GBP</td>
                                <td>Unemployment Rate</td>
                                <td><div className="yellow-impact"></div></td>
                            </tr>
                            <tr>
                                <td>8:45am</td>
                                <td>EUR</td>
                                <td>French Industrial Production m/m</td>
                                <td><div className="yellow-impact"></div></td>
                            </tr>
                            <tr>
                                <td>11:00am</td>
                                <td>EUR</td>
                                <td>German ZEW Economic Sentiment</td>
                                <td><div className="orange-impact"></div></td>
                            </tr>
                            <tr>
                                <td>11:00am</td>
                                <td>EUR</td>
                                <td>ZEW Economic Sentiment</td>
                                <td><div className="yellow-impact"></div></td>
                            </tr>
                            <tr>
                                <td>12:00pm</td>
                                <td>USD</td>
                                <td>NFIB Small Business Index</td>
                                <td><div className="yellow-impact"></div></td>
                            </tr>
                            <tr>
                                <td>Tentative</td>
                                <td>GBP</td>
                                <td>NIESR GDP Estimate</td>
                                <td><div className="yellow-impact"></div></td>
                            </tr>
                            <tr>
                                <td>7:01pm</td>
                                <td>USD</td>
                                <td>10-y Bond Auction</td>
                                <td><div className="yellow-impact"></div></td>
                            </tr>
                            {/* <tr>
                                <td>4:00pm</td>
                                <td>USD</td>
                                <td>Final Wholesale Inventories m/m</td>
                                <td><div className="yellow-impact"></div></td>
                            </tr>
                            <tr>
                                <td>9:00pm</td>
                                <td>USD</td>
                                <td>Consumer Credit m/m</td>
                                <td><div className="yellow-impact"></div></td>
                            </tr> */}
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
