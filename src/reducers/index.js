import Web3 from 'web3';

const web3 = new Web3("http://localhost:9545");
window.web3 = web3;

const defaultState = {
    web3: web3,
    isBusy: false,
    currentAccount: null,
    currentBalance: '0',
    accounts: [],
    ChainList: null
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'GET_ACCOUNTS_START':
        case 'GET_CURRENT_BALANCE_START':
        case 'INIT_CONTRACT_START':
        case 'SELL_ARTICLE_START':
            return {
                ...state,
                isBusy: true
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
        case 'GET_CURRENT_BALANCE_DONE':
            return {
                ...state,
                currentBalance: action.balance,
                isBusy: false
            };
        case 'INIT_CONTRACT_DONE':
            window.ChainList = action.ChainList;
            return {
                ...state,
                ChainList: action.ChainList
            };
        default:
            return state
    }
};
