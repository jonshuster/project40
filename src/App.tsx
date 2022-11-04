import React, { useEffect } from "react";
import './assets/css/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCakeCandles } from '@fortawesome/free-solid-svg-icons'
import HolidayDetails from './HolidayDetails';
import RSVPComponents from "./RSVPComponents";


const App = () => {
	useEffect(() => {        
		window.executeMainJs() // Part of the HTML Template, needs to be called after React has updated the DOM
		document.body.classList.remove('is-preload'); // Part of the HTML Template, makes the banner 'fade in'
    }, []);
	return (
		<div className="App" id="page-wrapper">
			{/* Header */}
			<header id="header" className="alt">
				<h1><a href="#banner">Jon's 40th</a></h1>
				<nav>
					<a href="#menu">Menu</a>
				</nav>
			</header>

			{/* Menu */}
			<nav id="menu">
				<div className="inner">
					<h2>Menu</h2>
					<ul className="links">
						<li><a href="#banner">Home</a></li>
						<li><a href="#details">Details</a></li>
						<li><a href="#rsvpForm">RSVP</a></li>
						<li><a href="#guestlist">Guest List</a></li>
					</ul>
					<div className="close">Close</div>
				</div>
			</nav>

			{/* Banner */}
			<section id="banner">
				<div className="inner">
					<div className="logo"><span className="icon"><FontAwesomeIcon icon={faCakeCandles} /></span></div>
					<h2>Jon's 40th</h2>
					<p>You're invited to come celebrate my birthday in Morzine!</p>
				</div>
			</section>

			{/* Main Content */}
			<section id="wrapper">
				<HolidayDetails />
				<RSVPComponents />
			</section>

			{/* Footer */}
			<section id="footer">
				<div className="inner">
					<ul className="copyright">
						<li>&copy; <a href="http://www.jonshuster.co.uk">JONATHAN SHUSTER</a></li><li>Design: <a href="http://html5up.net">HTML5 UP</a></li>
					</ul>
				</div>
			</section>

		</div>
	)
}

export default App;
