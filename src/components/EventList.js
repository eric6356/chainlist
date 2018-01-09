import React from 'react';
import PropTypes from 'prop-types';
import {Account, Event} from "../types";
import {connect} from "react-redux";

const EventList = ({events, currentAccount}) => {
    return (
        // todo
        <div>EventList</div>
    )
};

EventList.propTypes = {
    events: PropTypes.arrayOf(Event),
    currentAccount: Account,
};

export default connect()(EventList);