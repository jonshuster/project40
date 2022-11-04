import React, { useEffect, useState } from 'react';
import './assets/css/main.css';

const GuestList = (props: { rsvpHost: string|undefined, rsvpFormStatus:any }) => {
    const [guestListData, setGuestList] = useState([]);
    useEffect(() => {
        const getGuestList = async () => {
            await fetch(`https://${props.rsvpHost}/exec`)
                .then(resp => resp.json())
                .then((data) => {
                    console.log('Guest List successfully received from RSVP API')
                    setGuestList(data);
                })
                .catch(error => console.log(error));
        };
        getGuestList();
    }, [props]);
    return (
            <div className="inner">
                <div className="content">
                    <h2 className="major">Guest List</h2>
                    <span>Currently attending...
                        <ul className="cols">
                            {guestListData.map((guest, i) => (
                                <li key={i}>{guest['shortName']} {guest['plusOne'] ? '(2)' : ''}</li>
                            ))}
                        </ul>
                    </span>
                </div>
            </div>
    )
}

export default GuestList;
