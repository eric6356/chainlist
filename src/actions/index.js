import axios from 'axios';
import TruffleContract from 'truffle-contract';

const getAccountsStart = () => ({type: 'GET_ACCOUNTS_START'});

const getAccountsDone = (accounts) => ({
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

const getCurrentBalanceStart = () => ({type: 'GET_CURRENT_BALANCE_START'});

const getCurrentBalanceDone = (balance) => ({type: 'GET_CURRENT_BALANCE_DONE', balance});

export const getCurrentBalance = () => (dispatch, getState) => {
    dispatch(getCurrentBalanceStart());
    const {web3, currentAccount} = getState();
    return web3.eth.getBalance(currentAccount.address)
        .then((balance) => {
            dispatch(getCurrentBalanceDone(balance.toString()));
        });
};

const sellArticleStart = () => ({type: 'SELL_ARTICLE_START'});

const sellArticleDone = () => ({type: 'SELL_ARTICLE_DONE'});

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

const initContractStart = () => ({type: 'INIT_CONTRACT_START'});

const initContractDone = (ChainList) => ({type: 'INIT_CONTRACT_DONE', ChainList});

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
            dispatch(listenToEvents());
            dispatch(getAllArticles());
        })
};

const listenToEvents = () => (dispatch, getState) => {
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

const listenToEventsStart = () => ({type: 'LISTEN_TO_EVENTS_START'});

const listenToEventsDone = () => ({type: 'LISTEN_TO_EVENTS_DONE'});

const articleOnSale = (event) => (dispatch) => {
    dispatch(getArticle(event.id));
    dispatch(({type: 'ARTICLE_ON_SALE', event}));
};

const articleSold = (event) => (dispatch) => {
    dispatch(getArticle(event.id));
    dispatch(({type: 'ARTICLE_SOLD', event}));
};

const parseEvent = event => ({
    event: event.event,
    name: event.args._name,
    id: parseInt(event.args._id, 10),
    seller: event.args._seller && {address: event.args._seller},
    buyer: event.args._buyer && {address: event.args._buyer},
    price: parseInt(event.args._price, 10),
});

const getAllArticlesStart = () => ({type: 'GET_ALL_ARTICLES_START'});
const getAllArticlesDone = () => ({type: 'GET_ALL_ARTICLES_DONE'});

const getArticleDone = (article) => ({type: 'GET_ARTICLE_DONE', article});

const getArticle = (articleId) => (dispatch, getState) => {
    const {ChainList} = getState();
    ChainList.deployed().then(instance => {
        return instance.articles(articleId)
            .then(article => dispatch(getArticleDone(parseArticle(article))));
    })
};

const getAllArticles = () => (dispatch, getState) => {
    dispatch(getAllArticlesStart);
    const {ChainList} = getState();
    ChainList.deployed().then(instance => {
        // return instance.getArticlesForSale();
        return instance.getNumberOfArticles();
    }).then(number => Promise.all(
        Array.from({length: number}, (x, i) => i + 1)
            .map(articleId => dispatch(getArticle(articleId)))
    )).then(() => dispatch(getAllArticlesDone()));
};

const parseArticle = article => ({
    id: parseInt(article[0], 10),
    seller: {address: article[1]},
    buyer: article[2] && {address: article[2]},
    name: article[3],
    description: article[4],
    price: parseInt(article[5], 10)
});

const buyArticleStart = () => ({type: 'BUY_ARTICLE_START'});
const buyArticleDone = () => ({type: 'BUY_ARTICLE_DONE'});

export const buyArticle = (articleId) => (dispatch, getState) => {
    dispatch(buyArticleStart());
    const {ChainList, currentAccount, articles} = getState();
    const article = articles.filter(article => article.id === articleId)[0];
    let chainListInstance;
    ChainList.deployed().then(instance => {
        chainListInstance = instance;
        chainListInstance.buyArticle(articleId, {
            from: currentAccount.address,
            value: article.price,
            gas: 500000,
        }).then(result => {
            dispatch(buyArticleDone());
            dispatch(getCurrentBalance());
        }).catch(console.log);
    })
};
