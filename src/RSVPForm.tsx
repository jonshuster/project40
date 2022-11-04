import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import React, { Fragment, useState } from 'react';
import './assets/css/main.css';

const RSVPForm = (props: { rsvpHost: string|undefined, rsvpFormStatus:any, setRsvpFormStatus:any }) => {
    const [rsvpFormData, setRsvpFormData] = useState({ name: '', email: '', status: "", plusOne: false, message: '' });

    const handleChange = (event: any) => {
        const { name, value, type, checked } = event.target;
        setRsvpFormData({ ...rsvpFormData, [name]: type === 'checkbox' ? checked : value });
    }
    const handleSubmit = (event: any) => {
        event.preventDefault(); // prevents the submit button from refreshing the page
        console.log('Submitting to RSVP Service. Form Data %s', JSON.stringify(rsvpFormData));
        /* 
            A POST of application/json to Google App Scripts requires CORS handling
            and can't configure CORS due to the way it's hosted. So sending as x-www-form-urlencoded
            which won't trigger CORS checks. However for convenience of encoding/decoding still 
            sending a JSON string rather formulating the URLParams and also expecting a json string response. 
            (Google only appears to allow configuration for Cloud Storage buckets)
        */
        fetch(`https://${props.rsvpHost}/exec`, {
            method: 'POST',
            body: JSON.stringify({
                action: 'new',
                name: rsvpFormData.name,
                email: rsvpFormData.email,
                status: rsvpFormData.status,
                plusOne: rsvpFormData.plusOne,
                message: rsvpFormData.message
            }),
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
        })
            .then(resp => resp.text())
            .then((data) => {
                var jsonResp = JSON.parse(data);
                console.log('Response received %s', JSON.stringify(jsonResp));
                if (jsonResp.result === 'success') { props.setRsvpFormStatus({ formSuccessfullySubmitted: true, errorOccurred: false }) }
                else { throw Error('RSVP Service encountered an issue') };
            })
            .catch((err) => {
                console.log('Error when submitting to RSVP Service: %s', err.message);
                props.setRsvpFormStatus({ formSuccessfullySubmitted: false, errorOccurred: true })
            });
    }

    return (
        <div className="inner">
            <div className="content">
                <h2 className="major">RSVP</h2>
                {!props.rsvpFormStatus.formSuccessfullySubmitted ?
                    <Fragment>
                        <p>Please let me know if you can / can't make it. I'll then be in touch regarding accommodation. To update please follow the link you received in your confirmation email or message me directly.</p>
                        <form onSubmit={handleSubmit}>
                            <div className="row gtr-uniform">
                                <div className="col-6 col-12-xsmall">
                                    <label htmlFor="rsvp-name">Name</label>
                                    <input type="text" id="rsvp-name" name="name" value={rsvpFormData.name} onChange={handleChange} required />
                                </div>
                                <div className="col-6 col-12-xsmall">
                                    <label htmlFor="rsvp-email">Email</label>
                                    <input type="email" id="rsvp-email" name="email" value={rsvpFormData.email} onChange={handleChange} required />
                                </div>
                                <div className="col-4 col-12-small">
                                    <input type="radio" id="rsvp-status-yes" name="status" value="Coming" checked={rsvpFormData.status === "Coming"} onChange={handleChange} required />
                                    <label htmlFor="rsvp-status-yes">Can Make It</label>
                                </div>
                                <div className="col-4 col-12-small">
                                    <input type="radio" id="rsvp-status-no" name="status" value="Not Coming" checked={rsvpFormData.status === "Not Coming"} onChange={handleChange} required />
                                    <label htmlFor="rsvp-status-no">Can't Make It</label>
                                </div>
                                <div className="col-4 col-12-small" style={{ visibility: rsvpFormData.status === "Coming" ? 'visible' : 'hidden' }}>
                                    <input type="checkbox" id="rsvp-plusone" name="plusOne" checked={rsvpFormData.plusOne} onChange={handleChange} />
                                    <label htmlFor="rsvp-plusone">Bringing a plus 1</label>
                                </div>
                                <div className="col-12">
                                    <label htmlFor="rsvp-message">Message</label>
                                    <textarea id="rsvp-message" name="message" value={rsvpFormData.message} onChange={handleChange} rows={2} />
                                </div>
                                <div className="col-12">
                                    <ul className="actions">
                                        <li>
                                            <input type="submit" value={props.rsvpFormStatus.errorOccurred ? 'Retry' : 'Submit'} className="primary" />
                                            {props.rsvpFormStatus.errorOccurred ? <strong className='error'><FontAwesomeIcon icon={faCircleExclamation} />&nbsp;&nbsp;
                                                Uh-oh, that didn't work. Please try again and if no luck drop me a message/email.</strong> : ''}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </form>
                    </Fragment> :
                    <p>Thanks for letting me know. You should have received an email confirmation, with more details and a link to change your mind.</p>
                }
            </div>
        </div>
    )
}

export default RSVPForm;
