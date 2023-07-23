import React, { useState, useEffect, Fragment } from 'react';
import './assets/css/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'
import CurrencyValue from './CurrencyValue';

const HolidayDetails = () => {
    const monthsAway = () => {
        const today = new Date();
        const birthday = new Date(2023, 7, 17); //7 = August (months start at zero)
        const monthDiff = birthday.getMonth() - today.getMonth() +
            (12 * (birthday.getFullYear() - today.getFullYear()));
        const dayDiff = Math.ceil( Math.abs(birthday.getTime() - today.getTime()) / (1000 * 3600 * 24)); // Div by Milliseconds in a day 
        return [monthDiff, dayDiff];
    }

    const [exchangeRates, setExchangeRates] = useState({});
    useEffect(() => {
        const getExchangeRates = async () => {
            const host = process.env.REACT_APP_FX_SERVICE_HOST;
            await fetch(`https://${host}/latest?from=EUR&to=GBP`)
                .then(resp => resp.json())
                .then((data) => {
                    console.log('Exchange rates successfully received from frankfurter API')
                    setExchangeRates(data.rates);
                })
                .catch(error => console.log(error));
        };

        getExchangeRates();
    }, []);

    //The table with the itinerary is quite wide for mobile screens
    const [isNarrowScreen, setIsNarrowScreen] = useState(false);
    useEffect(() => {
        // For Initial Value
        const mediaWatcher = window.matchMedia("(max-width: 593px)")
        setIsNarrowScreen(mediaWatcher.matches);

        // For Updates
        function updateIsNarrowScreen(e: any) { setIsNarrowScreen(e.matches) };
        mediaWatcher.addEventListener('change', updateIsNarrowScreen);

        // Supply React a Cleanup Function in case this component is unmounted
        return function cleanup() { mediaWatcher.removeEventListener('change', updateIsNarrowScreen) }
    }, []);
    return (
        <div>
            {/* Overview */}
            <section id="overview" className="wrapper spotlight style2">
                <div className="inner">
                    <a href="#overview" className="image"><img src={require('./assets/images/jsheartmorzine.jpg')} alt="" /></a>
                    <div className="content">
                        <p>As you all know I've recently been spending more time in the mountains in the French town of Morzine. I could think of no better place to gather you all to celebrate my 40th birthday and for you to experience the mountains!</p>
                        <p>{ monthsAway()[0] > 1 ? <Fragment>There are {monthsAway()[0]} months to go, so please RSVP if you can make it.</Fragment>:
                                                   <Fragment>Only {monthsAway()[1]} days to go!</Fragment>}</p>
                    </div>
                </div>
            </section>

            {/* Details */}
            <section id="details" className="wrapper alt style1">
                <div className="inner">
                    <div className="content">
                        {/* <!-- Details - Dates --> */}
                        <h2 className="major">Dates</h2>
                        <p>My Birthday is on Thursday August 17th and it would be great for you to be there for that. I'm suggesting four nights into the weekend so we can do a range of activities. However if you want to make the most of a flight and come for longer there is plenty to do and I'll probably be around. </p>
                        <p className="align-center"><b>Wednesday 16th August → Sunday 20th August</b></p>
                        {/* <!-- Details - Itinerary --> */}
                        <h2 className="major">Itinerary</h2>
                        <p>To give you an idea of what we'd get up to, I've laid out an example itinerary of activities across the week. Where they are perhaps too extreme for your liking, there are alternatives and the option to just chill.</p>
                        <div className="table-wrapper">
                            <table className="alt">
                                <thead>
                                    <tr>
                                        <th>&nbsp;</th>
                                        <th>Wed 16th</th>
                                        <th>Thu 17th</th>
                                        <th>Fri 18th</th>
                                        <th>Sat 19th</th>
                                        <th>Sun 20th</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="align-center-i">
                                        <td>&nbsp;</td>
                                        <td>Travel Day</td>
                                        <td>Birthday Day</td>
                                        <td>Mountain Hike</td>
                                        <td>Mountain Trails</td>
                                        <td>Travel Day</td>
                                    </tr>
                                    <tr>
                                        <td><b>Morning</b></td>
                                        <td>Travel</td>
                                        <td>Cascade Adventure / Chill</td>
                                        <td>Group Hike</td>
                                        <td>Downhill MTB Trails / Pool Day</td>
                                        <td>Goodbye Brunch</td>
                                    </tr>
                                    <tr>
                                        <td><b>Afternoon</b></td>
                                        <td>Explore Town</td>
                                        <td>Lac Swim with Paddle / Games</td>
                                        <td>Group Hike with Optional Zipline</td>
                                        <td>Mountain Top Drinks</td>
                                        <td>Travel</td>
                                    </tr>
                                    <tr>
                                        <td><b>Evening</b></td>
                                        <td>Welcome Drinks / Dinner</td>
                                        <td>Birthday Party</td>
                                        <td>Drinks & Pizza chez Jon</td>
                                        <td>Night Out</td>
                                        <td>&nbsp;</td>
                                    </tr>
                                </tbody>
                            </table>
                            {isNarrowScreen ? <p className="align-center">Scroll For Full Itinerary<FontAwesomeIcon icon={faAnglesRight} /></p> : <Fragment />}
                        </div>
                        <div className="box alt">
                            <div className="row gtr-uniform">
                                <div className="col-12"><span className="image fit"><img src={require('./assets/images/pic01.jpg')} alt="" /></span></div>
                                <div className="col-4"><span className="image fit"><img src={require('./assets/images/pic02.jpg')} alt="" /></span></div>
                                <div className="col-4"><span className="image fit"><img src={require('./assets/images/pic03.jpg')} alt="" /></span></div>
                                <div className="col-4"><span className="image fit"><img src={require('./assets/images/pic04.jpg')} alt="" /></span></div>
                            </div>
                        </div>
                        {/* Details - Prices*/}
                        <h2 className="major">Prices</h2>
                        <p>These are obviously somewhat variable depending on when we book. Accommodation is the largest cost, some will be able to stay at mine, as soon as I know who's coming I'll arrange some group accommodation. Based on recent availability, these prices should be enough to give you an idea:</p>
                        <h3>Wed - Sun:</h3>
                        <ul>
                            <li>Flights: £80 &nbsp;<i>(Return Gatwick Easyjet)</i></li>
                            <li>Accommodation: <CurrencyValue rates={exchangeRates} currency='€' amount={300} /> &nbsp;<i>(Based on sharing, including continental breakfast)</i></li>
                            <li>Transfers: <CurrencyValue rates={exchangeRates} currency='€' amount={20} /> to <CurrencyValue rates={exchangeRates} currency='€' amount={80} /> &nbsp;<i>(Range from public transport to private transfer)</i></li>
                        </ul>
                        <h3>Activities</h3>
                        <ul>
                            <li>Downhill MTB Bike Hire, Lesson and Lift Pass: <CurrencyValue rates={exchangeRates} currency='€' amount={170} /></li>
                            <li>Lift Pass for Hiking: <CurrencyValue rates={exchangeRates} currency='€' amount={12} /></li>
                            <li>Paddleboard Hire: <CurrencyValue rates={exchangeRates} currency='€' amount={20} /></li>
                            <li>Rafting or Canyoning: <CurrencyValue rates={exchangeRates} currency='€' amount={60} /></li>
                            <li>Cascade Adventure: <CurrencyValue rates={exchangeRates} currency='€' amount={30} /></li>
                            <li>Zip Line 'Fantasticable': <CurrencyValue rates={exchangeRates} currency='€' amount={35} /></li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HolidayDetails;
