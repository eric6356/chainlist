import Web3 from 'web3';

const defaultState = {
    web3: new Web3("http://localhost:9545"),
    isBusy: false,
    currentAccount: null,
    currentBalance: '0',
    accounts: []
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'GET_ACCOUNTS_START':
            return {
                ...state,
                isBusy: true,
                accounts: []
            };
        case 'GET_ACCOUNTS_DONE':
            return {
                ...state,
                isBusy: false,
                accounts: action.accounts
            };
        case 'SET_CURRENT_ACCOUNT':
            return {
                ...state,
                currentAccount: state.accounts[action.i]
            };
        case 'GET_CURRENT_BALANCE_START':
            return {
                ...state,
                isBusy: true
            };
        case 'GET_CURRENT_BALANCE_DONE':
            return {
                ...state,
                currentBalance: action.balance,
                isBusy: false
            };
        default:
            return state
    }
};
