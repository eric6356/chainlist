import React from 'react';
import {Account, Event} from "../types";
import {compareAccount} from "../utils";

const EventItem = ({event, currentAccount}) => {
    const sellerAddress = compareAccount(event.seller, currentAccount) ? 'You' : event.seller && event.seller.address;
    const buyerAddress = compareAccount(event.buyer, currentAccount) ? 'You' : event.buyer && event.buyer.address;
    let messageBody;
    if (event.event === 'sellArticleEvent') {
        messageBody = <p>{event.name} is on sale <br/>seller: {sellerAddress}</p>;
    } else {
        messageBody = <p>{event.name} is sold<br/>buyer: {buyerAddress}</p>;
    }

    return (
        <article className="message">
            <div className="message-body" style={{overflowWrap: "break-word"}}>
                {messageBody}
            </div>
        </article>
    )
};

EventItem.propTypes = {
    event: Event,
    currentAccount: Account,
};

export default EventItem;