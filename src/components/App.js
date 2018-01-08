import React from 'react';

import AccountDropdown from "./AccountDropdown";
import SellArticle from "./SellArticle";
import EventList from "./EventList";
import ArticleList from "./ArticleList";

const accounts = [
    {address: '0x627306090abab3a6e1400e9345bc60c78a8bef57'},
    {address: '0xf17f52151ebef6c7334fad080c5704d77216b732'},
    {address: '0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef'},
];

const currentAccount = {address: '0x627306090abab3a6e1400e9345bc60c78a8bef57'};

class App extends React.Component {
    switchToAccount(i) {
        console.log(i);
    }

    render() {
        return (
            <div className="container">
                <div className="hero" style={{marginTop: '50px'}}>
                    <h1 className="title is-marginless">ChainList</h1>
                    <hr className="is-marginless"/>
                </div>
                <div style={{margin: "20px 0"}}>
                    <span className="tag is-medium">100 ETH</span>
                    <div className="is-pulled-right">
                        <AccountDropdown
                            accounts={accounts}
                            switchToAccount={this.switchToAccount}
                            currentAccount={currentAccount}
                        />
                    </div>
                </div>
                <SellArticle/>
                <div className="columns" style={{marginTop: "20px"}}>
                    <div className="column is-one-third">
                        <EventList
                            currentAccount={currentAccount}
                            events={[]}
                        />
                    </div>
                    <div className="column">
                        <ArticleList currentAccount={currentAccount} articles={[]}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
