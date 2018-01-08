// Contract to be tested
var ChainList = artifacts.require('./ChainList.sol');

// Test suite
contract('ChainList', function (accounts) {
    var chainListInstance;
    var seller = accounts[1];
    var buyer = accounts[2];
    var articleId = 1;
    var articleName = 'article 1';
    var articleDescription = 'Description for article 1';
    var articlePrice = 10;
    var articlePriceWei = web3.toWei(articlePrice, 'ether');

    // Test case: getting articles for sale when no article for sale yet
    it('should throw an exception if you try to get articles for sale when there is no article at all', function () {
        return ChainList.deployed().then(function (instance) {
            chainListInstance = instance;
            return chainListInstance.getArticlesForSale();
        }).then(assert.fail).catch(function (reason) {
            assert(reason.message.indexOf('revert') >= 0, 'error message must contain revert');
        })
    });

    // Test case: no article for sale yet
    it('should throw an exception if you try to buy an article when there is no article for sale', function () {
        return ChainList.deployed().then(function (instance) {
            chainListInstance = instance;
            return chainListInstance.buyArticle(articleId, {from: buyer, value: articlePriceWei}
            );
        }).then(assert.fail).catch(function (reason) {
            assert(reason.message.indexOf('revert') >= 0, 'error message must contain revert');
        }).then(function () {
            return chainListInstance.getNumberOfArticles();
        }).then(function (data) {
            assert.equal(data.toNumber(), 0, 'number of articles must be 0');
        })
    });

    // Test case: buying an article that does not exist
    it('should throw an exception if you try to buy an article that does not exist', function () {
        return ChainList.deployed().then(function (instance) {
            chainListInstance = instance;
            return chainListInstance.sellArticle(articleName, articleDescription, articlePriceWei, {from: seller});
        }).then(function (receipt) {
            return chainListInstance.buyArticle(2, {from: buyer, value: articlePriceWei})
        }).then(assert.fail).catch(function (reason) {
            assert(reason.message.indexOf('revert') >= 0, 'error message must contain revert');
        }).then(function () {
            return chainListInstance.articles(articleId);
        }).then(function (data) {
            // state not altered
            assert.equal(data[0].toNumber(), articleId, 'article id must still be ' + articleId);
            assert.equal(data[1], seller, 'seller must still be ' + seller);
            assert.equal(data[2], 0x0, 'buyer must still be empty');
            assert.equal(data[3], articleName, 'article name must still be ' + articleName);
            assert.equal(data[4], articleDescription, 'articles description must still be ' + articleDescription);
            assert.equal(data[5].toNumber(), articlePriceWei, 'article price must still be ' + articlePriceWei);
        })
    });

    // Test case: buying an article you are selling
    it('should throw an exception if you try to buy your own article', function () {
        return ChainList.deployed().then(function (instance) {
            chainListInstance = instance;
            return chainListInstance.buyArticle(articleId, {from: seller, value: articlePriceWei})
        }).then(assert.fail).catch(function (reason) {
            assert(reason.message.indexOf('revert') >= 0, 'error should be revert');
        }).then(function () {
            return chainListInstance.articles(articleId);
        }).then(function (data) {
            // state not altered
            assert.equal(data[0].toNumber(), articleId, 'article id must still be ' + articleId);
            assert.equal(data[1], seller, 'seller must still be ' + seller);
            assert.equal(data[2], 0x0, 'buyer must still be empty');
            assert.equal(data[3], articleName, 'article name must still be ' + articleName);
            assert.equal(data[4], articleDescription, 'articles description must still be ' + articleDescription);
            assert.equal(data[5].toNumber(), articlePriceWei, 'article price must still be ' + articlePriceWei);
        })
    });

    // Test case: buying an article with insufficient ETH
    it('should throw an exception if you try to buy article with insufficient ETH', function () {
        return ChainList.deployed().then(function (instance) {
            chainListInstance = instance;
            return chainListInstance.buyArticle(articleId, {from: buyer, value: web3.toWei(articlePrice - 1)})
        }).then(assert.fail).catch(function (reason) {
            assert(reason.message.indexOf('revert') >= 0, 'error should be revert');
        }).then(function () {
            return chainListInstance.articles(articleId);
        }).then(function (data) {
            // state not altered
            assert.equal(data[0].toNumber(), articleId, 'article id must still be ' + articleId);
            assert.equal(data[1], seller, 'seller must still be ' + seller);
            assert.equal(data[2], 0x0, 'buyer must still be empty');
            assert.equal(data[3], articleName, 'article name must still be ' + articleName);
            assert.equal(data[4], articleDescription, 'articles description must still be ' + articleDescription);
            assert.equal(data[5].toNumber(), articlePriceWei, 'article price must still be ' + articlePriceWei);
        })
    });

    // Test case: not allow to buy an article already sold
    it('should throw an exception if you try to buy an article that has already been sold', function () {
        return ChainList.deployed().then(function (instance) {
            chainListInstance = instance;
            return chainListInstance.buyArticle(articleId, {from: buyer, value: articlePriceWei});
        }).then(function () {
            return chainListInstance.buyArticle(articleId, {from: buyer, value: articlePriceWei});
        }).then(assert.fail).catch(function (reason) {
            assert(reason.message.indexOf('revert') >= 0, 'error should be revert');
        }).then(function () {
            return chainListInstance.articles(articleId);
        }).then(function (data) {
            // state not altered
            assert.equal(data[0].toNumber(), articleId, 'article id must still be ' + articleId);
            assert.equal(data[1], seller, 'seller must still be ' + seller);
            assert.equal(data[2], buyer, 'buyer must still be ' + buyer);
            assert.equal(data[3], articleName, 'article name must still be ' + articleName);
            assert.equal(data[4], articleDescription, 'articles description must still be ' + articleDescription);
            assert.equal(data[5].toNumber(), articlePriceWei, 'article price must still be ' + articlePriceWei);
        })
    })
});