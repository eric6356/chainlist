export const getAccountsStart = () => ({type: 'GET_ACCOUNTS_START'});

export const getAccountsDone = (accounts) => ({
  type: 'GET_ACCOUNTS_DONE',
  accounts: accounts.map(account => ({address: account}))
});

export const getAccounts = () => (dispatch, getState) => {
    dispatch(getAccountsStart());
    return getState().web3.eth.getAccounts()
        .then(accounts => {
            dispatch(getAccountsDone(accounts));
            dispatch(setCurrentAccount(0));
            return dispatch(getCurrentBalance());
        });
};

export const setCurrentAccount = (i) => ({type: 'SET_CURRENT_ACCOUNT', i});

export const getCurrentBalanceStart = () => ({type: 'GET_CURRENT_BALANCE_START'});

export const getCurrentBalanceDone = (balance) => ({type: 'GET_CURRENT_BALANCE_DONE', balance});

export const getCurrentBalance = () => (dispatch, getState) => {
    dispatch(getCurrentBalanceStart());
    const {web3, currentAccount} = getState();
    return web3.eth.getBalance(currentAccount.address)
        .then((balance) => {
            dispatch(getCurrentBalanceDone(balance.toString()));
        });
}
