import React from 'react';

import AccountBar from "./AccountBar";
import SellArticle from "./SellArticle";
import EventList from "./EventList";
import ArticleList from "./ArticleList";

const App = () => (
    <div className="container">
        <div className="hero" style={{marginTop: '50px'}}>
            <h1 className="title is-marginless">ChainList</h1>
            <hr className="is-marginless"/>
        </div>
        <AccountBar />
        <SellArticle/>
        <div className="columns" style={{marginTop: "20px"}}>
            <div className="column is-one-third">
                <EventList />
            </div>
            <div className="column">
                <ArticleList />
            </div>
        </div>
    </div>
);

export default App;
