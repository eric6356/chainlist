App = {
    web3Provider: null,
    contracts: {},
    account: 0x0,

    init: function () {
        return App.initWeb3();
    },

    initWeb3: function () {
        // Initialize web3 and set the provider to the truffle dev
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            // set the provider you want from Web3.providers
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:9545');
            web3 = new Web3(App.web3Provider);
        }
        App.displayAccountInfo();
        return App.initContract();
    },

    displayAccountInfo: function () {
        web3.eth.getCoinbase(function (err, account) {
            if (err === null) {
                App.account = account;
                $('#account').text(account);
                web3.eth.getBalance(account, function (err, balance) {
                    if (err === null) {
                        $('#accountBalance').text(web3.fromWei(balance, 'ether') + "  ETH");
                    }
                })
            }
        })
    },

    initContract: function () {
        $.getJSON('ChainList.json', function (chainListArtifact) {
            // Get the necessary contract artifact file and use it to instantiate a truffle contract abstraction.
            App.contracts.ChainList = TruffleContract(chainListArtifact);
            // Set the provider for our contract.
            App.contracts.ChainList.setProvider(App.web3Provider);
            App.reloadArticles();
        })
    },

    reloadArticles: function () {
        // refresh account information because the balance mey have changed
        App.displayAccountInfo();

        App.contracts.ChainList.deployed().then(function (instance) {
            return instance.getArticle.call();
        }).then(function (article) {
            if (article[0] === 0x0) {
                // no article
                return;
            }

            // Retrieve and clear the article placeholder
            var articleRow = $('#articlesRow');
            articleRow.empty();

            // Retrieve and fill the article template
            var articleTemplate = $('#articleTemplate');
            articleTemplate.find('.panel-title').text(article[1]);
            articleTemplate.find('.article-description').text(article[2]);
            articleTemplate.find('.article-price').text(web3.fromWei(article[3], 'ether'));

            var seller = article[0];
            if (seller === App.account) {
                seller = 'You';
            }
            articleTemplate.find('.article-seller').text(seller);

            // add this new article
            articleRow.append(articleTemplate.html());
        }).catch(function (reason) {
            console.log(reason.message)
        })
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
