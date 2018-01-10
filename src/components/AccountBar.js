import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import {connect} from "react-redux";

import {Account} from "../types";
import {setCurrentAccount, getCurrentBalance} from "../actions";
import {compareAccount} from "../utils";


const AccountBar = ({web3, accounts, currentAccount, currentBalance, setCurrentAccount}) => {
    return (
        <div style={{margin: "20px 0"}}>
            <span className="tag is-medium">{web3.utils.fromWei(currentBalance, "ether")} ETH</span>
            <div className="is-pulled-right">
                <div className="field has-addons">
                    <div className="control">
                        <input className="input" type="text" value={currentAccount ? currentAccount.address : ""} readOnly style={{width: "440px"}}/>
                    </div>
                    <div className="control">
                        <div className="dropdown is-hoverable is-right">
                            <div className="dropdown-trigger">
                                <button className="button">
                                    {/*<span style={{}}>{currentAccount && currentAccount.address}</span>*/}
                                    <span className="icon is-small">
                                        <i className="fa fa-angle-down"/>
                                    </span>
                                </button>
                            </div>
                            <div className="dropdown-menu">
                                <div className="dropdown-content">
                                    {accounts.map((account, index) => {
                                        return (
                                            <a
                                                key={index}
                                                className={classNames('dropdown-item', {'is-active': compareAccount(currentAccount, account)})}
                                                onClick={() => setCurrentAccount(index)}
                                            >
                                                {account.address}
                                            </a>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};


AccountBar.propTypes = {
    accounts: PropTypes.arrayOf(Account),
    switchToAccount: PropTypes.func,
    currentAccount: Account,
    currentBalance: PropTypes.string
};

export default connect(
    state => state,
    dispatch => ({
        setCurrentAccount: i => {
            dispatch(setCurrentAccount(i));
            dispatch(getCurrentBalance());
        }
    })
)(AccountBar);
