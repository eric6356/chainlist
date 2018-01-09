import axios from 'axios';
import TruffleContract from 'truffle-contract';

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
};

export const sellArticleStart = () => ({type: 'SELL_ARTICLE_START'});

export const sellArticleDone = () => ({type: 'SELL_ARTICLE_DONE'});

export const sellArticle = ({name, description, price}) => (dispatch, getState) => {
    dispatch(sellArticleStart());
    const {ChainList, currentAccount} = getState();
    return ChainList.deployed().then(instance => {
        return instance.sellArticle(
            name,
            description,
            price,
            {from: currentAccount.address, gas: 500000}
        )
    }).then((result) => {
        dispatch(sellArticleDone());
        dispatch(getCurrentBalance());
    }).catch(console.log);
};

export const initContractStart = () => ({type: 'INIT_CONTRACT_START'});

export const initContractDone = (ChainList) => ({type: 'INIT_CONTRACT_DONE', ChainList});

export const initContract = () => (dispatch, getState) => {
    dispatch(initContractStart());
    const {web3} = getState();
    axios.get('/contracts/ChainList.json')
        .then(res => {
            const ChainList = TruffleContract(res.data);
            ChainList.setProvider(web3.currentProvider);
            // FIXME: https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
            if (typeof ChainList.currentProvider.sendAsync !== "function") {
                ChainList.currentProvider.sendAsync = function () {
                    return ChainList.currentProvider.send.apply(
                        ChainList.currentProvider, arguments
                    );
                };
            }
            dispatch(initContractDone(ChainList));
            return dispatch(listenToEvents());
        })
};

export const listenToEvents = () => (dispatch, getState) => {
    dispatch(listenToEventsStart());
    const {ChainList} = getState();
    ChainList.deployed().then(instance => {
        instance.sellArticleEvent({}, {
            fromBlock: 0,
            toBlock: 'latest'
        }).watch((err, ev) => {
            if (!err) {
                dispatch(articleOnSale(parseEvent(ev)))
            } else {
                console.log(err);
            }
        });

        instance.buyArticleEvent({}, {
            fromBlock: 0,
            toBlock: 'latest'
        }).watch((err, ev) => {
            if (!err) {
                dispatch(articleSold(parseEvent(ev)))
            } else {
                console.log(err);
            }
        });

        dispatch(listenToEventsDone());
    });
};

export const listenToEventsStart = () => ({type: 'LISTEN_TO_EVENTS_START'});

export const listenToEventsDone = () => ({type: 'LISTEN_TO_EVENTS_DONE'});

const articleOnSale = (event) => ({type: 'ARTICLE_ON_SALE', event});

const articleSold = (event) => ({type: 'ARTICLE_SOLD', event});

const parseEvent = event => ({
    event: event.event,
    name: event.args._name,
    id: parseInt(event.args._id, 10),
    seller: event.args._seller && {address: event.args._seller},
    buyer: event.args._buyer && {address: event.args._buyer},
    price: parseInt(event.args._price, 10),
});
