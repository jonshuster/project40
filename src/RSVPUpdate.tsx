
import './assets/css/main.css';
import React, { Fragment, useState } from 'react';
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'

const RSVPUpdate = () => {
    const { uid } = useParams();
    const [rsvpFormData, setRsvpFormData] = useState({ status: "", plusOne: false, wedActivity: "", satActivity: "" });
    const [rsvpFormStatus, setRsvpFormStatus] = useState({ formSuccessfullySubmitted: false, errorOccurred: false });
    const rsvpHost = process.env.REACT_APP_RSVP_SERVICE_HOST;

    const handleChange = (event: any) => {
        const { name, value, type, checked } = event.target;
        setRsvpFormData({ ...rsvpFormData, [name]: type === 'checkbox' ? checked : value });
    }
    const handleSubmit = (event: any) => {
        event.preventDefault(); // prevents the submit button from refreshing the page
        console.log('Submitting update to RSVP Service for UID %s Form Data %s', uid, JSON.stringify(rsvpFormData));
        /* 
            A POST of application/json to Google App Scripts requires CORS handling
            and can't configure CORS due to the way it's hosted. So sending as x-www-form-urlencoded
            which won't trigger CORS checks. However for convenience of encoding/decoding still 
            sending a JSON string rather formulating the URLParams and also expecting a json string response. 
            (Google only appears to allow configuration for Cloud Storage buckets)
        */
        fetch(`https://${rsvpHost}/exec`, {
            method: 'POST',
            body: JSON.stringify({
                action: 'update',
                uid: uid,
                status: rsvpFormData.status,
                plusOne: rsvpFormData.plusOne,
                wedActivity: rsvpFormData.wedActivity,
                satActivity: rsvpFormData.satActivity
            }),
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
        })
            .then(resp => resp.text())
            .then((data) => {
                var jsonResp = JSON.parse(data);
                console.log('Response received %s', JSON.stringify(jsonResp));
                if (jsonResp.result === 'success') { setRsvpFormStatus({ formSuccessfullySubmitted: true, errorOccurred: false }) }
                else { throw Error('RSVP Service encountered an issue') };
            })
            .catch((err) => {
                console.log('Error when submitting update to RSVP Service: %s', err.message);
                setRsvpFormStatus({ formSuccessfullySubmitted: false, errorOccurred: true })
            });
    }

    return (
        <section id="rsvpUpdate" className="wrapper alt style6">
            <div className="inner">
                <div className="content">
                    <h2 className="major">RSVP Update</h2>
                    {!rsvpFormStatus.formSuccessfullySubmitted ?
                        <Fragment>
                            <p>To update your details and select activities please confirm if you can make it and submit:</p>
                            <form onSubmit={handleSubmit}>
                                <div className="row gtr-uniform">
                                    <div className="col-4 col-12-small">
                                        <input type="radio" id="rsvp-status-yes" name="status" value="Coming" checked={rsvpFormData.status === "Coming"} onChange={handleChange} required />
                                        <label htmlFor="rsvp-status-yes">Can Make It</label>
                                    </div>
                                    <div className="col-4 col-12-small">
                                        <input type="radio" id="rsvp-status-no" name="status" value="Cancelled" checked={rsvpFormData.status === "Cancelled"} onChange={handleChange} required />
                                        <label htmlFor="rsvp-status-no">Can't Make It</label>
                                    </div>
                                    <div className="col-4 col-12-small" style={{ visibility: rsvpFormData.status === "Coming" ? 'visible' : 'hidden' }}>
                                        <input type="checkbox" id="rsvp-plusone" name="plusOne" checked={rsvpFormData.plusOne} onChange={handleChange} />
                                        <label htmlFor="rsvp-plusone">Bringing a plus 1</label>
                                    </div>
                                    <div className="col-6 col-12-small" style={{ visibility: rsvpFormData.status === "Coming" ? 'visible' : 'hidden' }}>
                                        <label htmlFor="wedActivity">Wednesday Activity</label>
                                        <select id="rsvp-wedActivity" name ="wedActivity" onChange={handleChange} required>
                                            <option value="">Please select...</option>
                                            <option value="rafting">White Water Rafting</option>
                                            <option value="chill">Chill</option>
                                        </select>
                                    </div>
                                    <div className="col-6 col-12-small" style={{ visibility: rsvpFormData.status === "Coming" ? 'visible' : 'hidden' }}>
                                        <label htmlFor="satActivity">Saturday Activity</label>
                                        <select id="rsvp-satActivity" name ="satActivity" onChange={handleChange} required>
                                            <option value="">Please select...</option>
                                            <option value="trails">MTB Trails</option>
                                            <option value="explore">MTB Explore</option>
                                            <option value="pool">Pool Day</option>
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <ul className="actions">
                                            <li>
                                                <input type="submit" value={rsvpFormStatus.errorOccurred ? 'Retry' : 'Submit'} className="primary" />
                                                {rsvpFormStatus.errorOccurred ? <strong className='error'><FontAwesomeIcon icon={faCircleExclamation} />&nbsp;&nbsp;
                                                    Uh-oh, that didn't work. Please try again and if no luck drop me a message/email.</strong> : ''}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </form>
                        </Fragment> :
                        <p>Thanks for letting me know. You should have received an email confirmation, with more details and a link to change your mind again if needed.</p>
                    }
                </div>
            </div>
        </section>
    )
}

export default RSVPUpdate;
