import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import {Account} from "../types";

const AccountDropdown = ({accounts, switchToAccount, currentAccount}) => {
    return (
        <div className="dropdown is-hoverable">
            <div className="dropdown-trigger">
                <button className="button">
                    <span>{currentAccount.address}</span>
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
                            className={classNames('dropdown-item', {'is-active': account.address === currentAccount.address})}
                            onClick={switchToAccount(index)}
                        >
                            {account.address}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
};


AccountDropdown.propTypes = {
    accounts: PropTypes.arrayOf(Account),
    switchToAccount: PropTypes.func,
    currentAccount: Account
};

export default AccountDropdown;
