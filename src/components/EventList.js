import React from 'react';
import PropTypes from 'prop-types';
import {Account, Event} from "../types";
import {connect} from "react-redux";
import EventItem from "./EventItem";

const EventList = ({events, currentAccount}) => {
    return (
        <div style={{width: "300px"}}>
            {events.map((event, i) => (
                <EventItem event={event} currentAccount={currentAccount} key={i} />
            ))}
        </div>
    )
};

EventList.propTypes = {
    events: PropTypes.arrayOf(Event),
    currentAccount: Account,
};

export default connect(
    state => state
)(EventList);