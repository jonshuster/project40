import React, { Fragment, useState } from 'react';
import './assets/css/main.css';
import GuestList from './GuestList';
import RSVPForm from './RSVPForm';

const RSVPComponents = () => {
    const [rsvpFormStatus, setRsvpFormStatus] = useState({ formSuccessfullySubmitted: false, errorOccurred: false });
    const rsvpHost = process.env.REACT_APP_RSVP_SERVICE_HOST;

    return (
        <Fragment>
        <section id="rsvpForm" className="wrapper style6"><RSVPForm rsvpHost={rsvpHost} rsvpFormStatus={rsvpFormStatus} setRsvpFormStatus={setRsvpFormStatus} /></section>
        <section id="guestlist" className="wrapper alt style2"><GuestList rsvpHost={rsvpHost} rsvpFormStatus={rsvpFormStatus} /></section>
        </Fragment>
    )
}

export default RSVPComponents;