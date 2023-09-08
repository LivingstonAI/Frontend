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
                    <h5 className="major-upcoming-news-events-header">Major Upcoming News Events:</h5>
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
