import Web3 from 'web3';

const defaultState = {
    web3: new Web3(Web3.givenProvider ||"http://localhost:9545"),
    isBusy: false,
    currentAccount: null,
    currentBalance: '0',
    accounts: [],
    ChainList: null,
    articles: [],
    events: [],
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'GET_ACCOUNTS_START':
        case 'GET_CURRENT_BALANCE_START':
        case 'INIT_CONTRACT_START':
        case 'SELL_ARTICLE_START':
        case 'LISTEN_TO_EVENTS_START':
        case 'GET_ALL_ARTICLES_START':
        case 'BUY_ARTICLE_START':
            return {
                ...state,
                isBusy: true
            };
        case 'SELL_ARTICLE_DONE':
        case 'LISTEN_TO_EVENTS_DONE':
        case 'GET_ALL_ARTICLES_DONE':
        case 'BUY_ARTICLE_DONE':
            return {
                ...state,
                isBusy: false
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
            return {
                ...state,
                ChainList: action.ChainList
            };
        case 'ARTICLE_ON_SALE':
        case 'ARTICLE_SOLD':
            return {
                ...state,
                events: [...state.events, action.event]
            };
        case 'GET_ARTICLE_DONE':
            const articles = state.articles.slice();
            const article = articles.find(article => article.id === action.article.id);
            if (article === undefined) {
                articles.push(action.article);
            } else {
                article.buyer = action.article.buyer;
            }
            return {
                ...state,
                articles: [...articles]
            };
        default:
            return state
    }
};
