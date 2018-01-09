import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { connect } from "react-redux";

import { Account } from "../types";
import { setCurrentAccount } from "../actions";


const AccountBar = ({web3, accounts, currentAccount, currentBalance, setCurrentAccount}) => {
    const balanceEther = web3.utils.fromWei(currentBalance);
    return (
        <div style={{margin: "20px 0"}}>
            <span className="tag is-medium">{balanceEther} ETH</span>
            <div className="is-pulled-right">
                <div className="dropdown is-hoverable">
                    <div className="dropdown-trigger">
                        <button className="button">
                            <span>{currentAccount && currentAccount.address}</span>
                            <span className="icon is-small">
                                <i className="fa fa-angle-down"/>
                            </span>
                        </button>
                    </div>
                    <div className="dropdown-menu">
                        <div className="dropdown-content">
                            {accounts.map((account, index) => (
                                <a
                                    key={index}
                                    className={classNames(
                                      'dropdown-item',
                                      {'is-active': currentAccount && (account.address === currentAccount.address)}
                                    )}
                                    onClick={setCurrentAccount(index)}
                                >
                                    {account.address}
                                </a>
                            ))}
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
        setCurrentAccount: i => () => dispatch(setCurrentAccount(i))
    })
)(AccountBar);
