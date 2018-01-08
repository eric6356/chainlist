import React from 'react';
import PropTypes from 'prop-types';
import {Account, BuyEvent, SellEvent} from "../types";

const EventList = ({events, currentAccount}) => {
    return (
        // todo
        <div>EventList</div>
    )
};

EventList.propTypes = {
    events: PropTypes.arrayOf(PropTypes.oneOfType([SellEvent, BuyEvent])),
    currentAccount: Account,
};

export default EventList;