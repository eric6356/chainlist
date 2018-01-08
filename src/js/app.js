App = {
    web3Provider: null,
    contracts: {},
    account: null, // Hex String

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

            // listen to events.
            App.listenToEvents();

            // Retrieve the article from the smart contract.
            return App.reloadArticles();
        })
    },

    reloadArticles: function () {
        // refresh account information because the balance mey have changed
        App.displayAccountInfo();

        App.contracts.ChainList.deployed().then(function (instance) {
            return instance.getArticle.call();
        }).then(function (article) {
            if (parseInt(article[0]) === 0x0) {
                // no article
                return;
            }

            // Retrieve and clear the article placeholder
            var articleRow = $('#articlesRow');
            articleRow.empty();

            var price = web3.fromWei(article[4], 'ether');

            // Retrieve and fill the article template
            var articleTemplate = $('#articleTemplate');
            articleTemplate.find('.panel-title').text(article[2]);
            articleTemplate.find('.article-description').text(article[3]);
            articleTemplate.find('.article-price').text(price);
            articleTemplate.find('.btn-buy').attr('data-value', price);

            var seller = article[0];
            if (seller === App.account) {
                seller = 'You';
            }
            articleTemplate.find('.article-seller').text(seller);

            var buyer = article[1];
            if (buyer === App.account) {
                buyer = 'You';
            } else if (parseInt(buyer) === 0) {
                buyer = 'No one yet';
            }
            articleTemplate.find('.article-buyer').text(buyer);

            if (seller === 'You' || parseInt(article[1]) !== 0x0) {
                articleTemplate.find('.btn-buy').parent().hide();
            }

            // add this new article
            articleRow.append(articleTemplate.html());
        }).catch(function (reason) {
            console.log(reason.message)
        })
    },

    sellArticle: function () {
        // Retrieve details of th the article
        var _article_name = $('#article_name').val();
        var _description = $('#article_description').val();
        var _price = web3.toWei(new web3.BigNumber($('#article_price').val() || 0), 'ether');

        if ((_article_name.trim() === '') || (_price === 0)) {
            // nothing to sell
            return false;
        }

        App.contracts.ChainList.deployed().then(function (instance) {
            return instance.sellArticle(
                _article_name,
                _description,
                _price,
                {from: App.account, gas: 5000000}
            )
        }).catch(function (reason) {
            console.log(reason.message);
        })
    },

    // Listen to events raised from the contract
    listenToEvents: function () {
        App.contracts.ChainList.deployed().then(function (instance) {
            instance.sellArticleEvent(
                {},
                {fromBlock: 0, toBlock: 'latest'}
            ).watch(function (error, event) {
                var articleName = event.args._name;
                var seller = event.args._seller;
                if (seller === App.account) {
                    seller = 'You';
                }
                var message = articleName + ' is for sale, seller: ' + seller;
                $('#events').append('<li class="list-group-item">' + message + '</li>');
                App.reloadArticles();
            });

            // instance.buyArticleEvent(
            //     {},
            //     {fromBlock: 0, toBlock: 'latest'}
            // ).watch(function (error, event) {
            //     var articleName = event.args._name;
            //     var buyer = event.args._buyer;
            //     if (buyer === App.account) {
            //         buyer = 'You';
            //     }
            //     var message = articleName + ' is sold to ' + buyer;
            //     $('#events').append('<li class="list-group-item">' + message + '</li>');
            //     App.reloadArticles();
            // })
        })
    },

    buyArticle: function () {
        var _price = new web3.BigNumber($(event.target).data('value'));

        App.contracts.ChainList.deployed().then(function (instance) {
            return instance.buyArticle({
                from: App.account,
                value: web3.toWei(_price, 'ether'),
                gas: 500000
            })
        }).then(function (result) {
            console.log(result);
        }).catch(function (reason) {
            console.log(reason.message);
        })
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
