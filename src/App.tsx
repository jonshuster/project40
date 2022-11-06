import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import './assets/css/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCakeCandles } from '@fortawesome/free-solid-svg-icons'
import HolidayDetails from './HolidayDetails';
import RSVPComponents from "./RSVPComponents";
import RSVPUpdate from "./RSVPUpdate";


const App = () => {
	useEffect(() => {
		window.executeMainJs() // Part of the HTML Template, needs to be called after React has updated the DOM
		document.body.classList.remove('is-preload'); // Part of the HTML Template, makes the banner 'fade in'
	}, []);
	return (
		<Router basename={'/project40'}>
			<div className="App" id="page-wrapper">
				{/* Header */}
				<header id="header" className="alt">
					<h1>Jon's 40th</h1>
					<nav>
						<Routes><Route path="/update/:uid" element={<a href="#menu">Menu</a>} /><Route path="*" element={<Fragment/>}/></Routes>
					</nav>
				</header>

				<Routes> 
					<Route path="*" element={<Fragment/>}/> {/* Can't get Links on the Menu working with Anchors, tried HashLinks uts v6 forked versions :( */}
					<Route path="/update/:uid" element={<Fragment>
					{/* Menu */}
					<nav id="menu">
						<div className="inner">
							<h2>Menu</h2>

							<ul className="links">
								<li><Link to="../">Home</Link></li>
							</ul>

							<div className="close">Close</div>
						</div>
					</nav>
				</Fragment>} />
				</Routes>

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
					<Routes>
						<Route
							path="*"
							element={<Fragment><HolidayDetails /><RSVPComponents /></Fragment>}
						/>
						<Route
							path="/update/:uid"
							element={<RSVPUpdate />}
						/>
					</Routes>

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
		</Router>
	)
}

export default App;
