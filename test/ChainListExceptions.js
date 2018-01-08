// Contract to be tested
var ChainList = artifacts.require('./ChainList.sol');

// Test suite
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

    // Test case: no article for sale yet
    it('should throw an exception if you try to buy an article when there is no article for sale', function () {
        return ChainList.deployed().then(function (instance) {
            chainListInstance = instance;
            return chainListInstance.buyArticle({
                from: buyer,
                value: web3.toWei(articlePrice, 'ether')
            });
        }).then(assert.fail).catch(function (reason) {
            assert(reason.message.indexOf('revert') >= 0, 'error should be revert');
        }).then(function () {
            return chainListInstance.getArticle.call();
        }).then(function (data) {
            // make sure the contract state was not altered
            assert.equal(data[0], 0x0, 'seller must be empty');
            assert.equal(data[1], 0x0, 'buyer must be empty');
            assert.equal(data[2], '', 'name must be empty');
            assert.equal(data[3], '', 'description must be empty');
            assert.equal(data[4].toNumber(), 0, 'price must be 0');
        })
    });

    // Test case: buying an article you are selling
    it('should throw an exception if you try to buy your own article', function () {
        return ChainList.deployed().then(function (instance) {
            chainListInstance = instance;
            return chainListInstance.sellArticle(articleName, articleDescription, articlePriceWei, {from: seller})
        }).then(function (receipt) {
            return chainListInstance.buyArticle({from: seller, value: articlePriceWei})
        }).then(assert.fail).catch(function (reason) {
            assert(reason.message.indexOf('revert') >= 0, 'error should be revert');
        }).then(function () {
            return chainListInstance.getArticle.call();
        }).then(function (data) {
            // make sure the contract state was not altered
            assert.equal(data[0], seller, 'seller must be ' + seller);
            assert.equal(data[1], 0x0, 'buyer must be empty');
            assert.equal(data[2], articleName, 'name must be ' + articleName);
            assert.equal(data[3], articleDescription, 'description must be ' + articleDescription);
            assert.equal(data[4].toNumber(), articlePriceWei, 'price must be ' + articlePriceWei);
        })
    });

    // Test case: buying an article with insufficient ETH
    it('should throw an exception if you try to buy article with insufficient ETH', function () {
        return ChainList.deployed().then(function (instance) {
            chainListInstance = instance;
            return chainListInstance.sellArticle(articleName, articleDescription, articlePriceWei, {from: seller})
        }).then(function (receipt) {
            return chainListInstance.buyArticle({from: buyer, value: web3.toWei(articlePrice - 1)})
        }).then(assert.fail).catch(function (reason) {
            assert(reason.message.indexOf('revert') >= 0, 'error should be revert');
        }).then(function () {
            return chainListInstance.getArticle.call();
        }).then(function (data) {
            // make sure the contract state was not altered
            assert.equal(data[0], seller, 'seller must be ' + seller);
            assert.equal(data[1], 0x0, 'buyer must be empty');
            assert.equal(data[2], articleName, 'name must be ' + articleName);
            assert.equal(data[3], articleDescription, 'description must be ' + articleDescription);
            assert.equal(data[4].toNumber(), articlePriceWei, 'price must be ' + articlePriceWei);
        })
    });

    // Test case: not allow to buy an article already sold
    it('should throw an exception if you try to buy an article that has already been sold', function () {
        return ChainList.deployed().then(function (instance) {
            chainListInstance = instance;
            return chainListInstance.sellArticle(articleName, articleDescription, articlePriceWei, {from: seller})
        }).then(function (receipt) {
            return chainListInstance.buyArticle({from: buyer, value: articlePriceWei});
        }).then(function () {
            return chainListInstance.buyArticle({from: buyer, value: articlePriceWei});
        }).then(assert.fail).catch(function (reason) {
            assert(reason.message.indexOf('revert') >= 0, 'error should be revert');
        }).then(function () {
            return chainListInstance.getArticle.call();
        }).then(function (data) {
            // make sure the contract state was not altered
            assert.equal(data[0], seller, 'seller must be ' + seller);
            assert.equal(data[1], buyer, 'buyer must be ' + buyer);
            assert.equal(data[2], articleName, 'name must be ' + articleName);
            assert.equal(data[3], articleDescription, 'description must be ' + articleDescription);
            assert.equal(data[4].toNumber(), articlePriceWei, 'price must be ' + articlePriceWei);
        })
    })
});