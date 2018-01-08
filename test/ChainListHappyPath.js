// Contract to be tested
var ChainList = artifacts.require('./ChainList.sol');

// Test suit
contract('ChainList', function (accounts) {
     var chainListInstance;
     var seller = accounts[1];
     var buyer = accounts[2];
     var articleName = 'article 1';
     var articleDescription = 'Description for article 1';
     var articlePrice = 10;
     var articlePriceWei = web3.toWei(articlePrice, 'ether');
     var buyerBalanceBeforeBuy, buyerBalanceAfterBuy;
     var sellerBalanceBeforeBuy, sellerBalanceAfterBuy;

    // Test case: check initial values
    it('should be initialized with empty values', function () {
        return ChainList.deployed().then(function (instance) {
            return instance.getArticle.call();
        }).then(function (data) {
            assert.equal(data[0], 0x0, 'seller must be empty');
            assert.equal(data[1], 0x0, 'buyer must be empty');
            assert.equal(data[2], '', 'article name must be empty');
            assert.equal(data[3], '', 'description must be empty');
            assert.equal(data[4].toNumber(), 0, 'article price must be zero');
        });
    });

    // Test case: sell an article
    it('should sell an article', function () {
        return ChainList.deployed().then(function (instance) {
            chainListInstance = instance;
            return chainListInstance.sellArticle(
                articleName,
                articleDescription,
                articlePriceWei,
                {from: seller}
            )
        }).then(function () {
            return chainListInstance.getArticle.call();
        }).then(function (data) {
            assert.equal(data[0], seller, 'seller must be ' + seller);
            assert.equal(data[1], 0x0, 'seller must be empty');
            assert.equal(data[2], articleName, 'article name must be ' + articleName);
            assert.equal(data[3], articleDescription, 'article description must be ' + articleDescription);
            assert.equal(data[4].toNumber(), articlePriceWei, 'article price must be ' + articlePriceWei);
        })
    });

    // Test case: should check events
    it('should trigger an event when a new article is sold', function () {
        return ChainList.deployed().then(function (instance) {
            chainListInstance = instance;
            return chainListInstance.sellArticle(
                articleName,
                articleDescription,
                articlePriceWei,
                {from: seller}
            );
        }).then(function (receipt) {
            assert.equal(receipt.logs.length, 1, 'should have received one event');
            assert.equal(receipt.logs[0].event, 'sellArticleEvent', 'event should be sellArticleEvent');
            assert.equal(receipt.logs[0].args._seller, seller, 'seller must be ' + seller);
            assert.equal(receipt.logs[0].args._name, articleName, 'article name must be ' + articleName);
            assert.equal(receipt.logs[0].args._price.toNumber(), articlePriceWei, 'article price must be ' + articlePriceWei);
        })
    });

    // Test case: buy an article after the seller article case
    it('should buy an article', function () {
        return ChainList.deployed().then(function (instance) {
            chainListInstance = instance;

            // record balance before buy
            sellerBalanceBeforeBuy = web3.fromWei(web3.eth.getBalance(seller)).toNumber();
            buyerBalanceBeforeBuy = web3.fromWei(web3.eth.getBalance(buyer)).toNumber();

            return chainListInstance.buyArticle({from: buyer, value: articlePriceWei});
        }).then(function (receipt) {
            assert.equal(receipt.logs.length, 1, 'one event should be triggered');
            assert.equal(receipt.logs[0].event, 'buyArticleEvent', 'event should be buyArticleEvent');
            assert.equal(receipt.logs[0].args._seller, seller, 'event seller must be ' + seller);
            assert.equal(receipt.logs[0].args._buyer, buyer, 'event buyer must be ' + buyer);
            assert.equal(receipt.logs[0].args._name, articleName, 'event name must be ' + articleName);
            assert.equal(receipt.logs[0].args._price, articlePriceWei, 'event price must be ' + articlePriceWei);

            // record balance after buy
            sellerBalanceAfterBuy = web3.fromWei(web3.eth.getBalance(seller)).toNumber();
            buyerBalanceAfterBuy = web3.fromWei(web3.eth.getBalance(buyer)).toNumber();

            // check the effect of buy on balances of buyer and seller, accounting for gas
            assert(sellerBalanceAfterBuy === sellerBalanceBeforeBuy + articlePrice, 'seller should have earned ' + articlePrice + 'ETH');
            assert(buyerBalanceAfterBuy <= buyerBalanceBeforeBuy - articlePrice, 'buyer should spend at least ' + articlePrice + 'ETH');

            return chainListInstance.getArticle.call();
        }).then(function (data) {
            assert.equal(data[0], seller, 'seller must be ' + seller);
            assert.equal(data[1], buyer, 'buyer must be ' + buyer);
            assert.equal(data[2], articleName, 'article name must be ' + articleName);
            assert.equal(data[3], articleDescription, 'article description must be ' + articleDescription);
            assert.equal(data[4].toNumber(), articlePriceWei, 'article price must be ' + articlePriceWei);
        });
    })
});
