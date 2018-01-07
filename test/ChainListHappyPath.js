// Contract to be tested
var ChainList = artifacts.require('./ChainList.sol');

// Test suit
contract('ChainList', function (accounts) {
     var chainListInstance;
     var seller = accounts[1];
     var articleName = 'article 1';
     var articleDescription = 'Description for article 1';
     var articlePrice = 10;
     var articlePriceWei = web3.toWei(articlePrice, 'ether');

    // Test case: check initial values
    it('should be initialized with empty values', function () {
        return ChainList.deployed().then(function (instance) {
            return instance.getArticle.call();
        }).then(function (data) {
            assert.equal(data[0], 0x0, 'seller must be empty');
            assert.equal(data[1], '', 'article name must be empty');
            assert.equal(data[2], '', 'description must be empty');
            assert.equal(data[3].toNumber(), 0, 'article price must be zero');
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
            assert.equal(data[1], articleName, 'article name must be ' + articleName);
            assert.equal(data[2], articleDescription, 'article description must be ' + articleDescription);
            assert.equal(data[3].toNumber(), articlePriceWei, 'article price must be ' + articlePriceWei);
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
            assert.equal(receipt.logs[0].args._seller, seller, 'seller must be ' + seller);
            assert.equal(receipt.logs[0].args._name, articleName, 'article name must be ' + articleName);
            assert.equal(receipt.logs[0].args._price.toNumber(), articlePriceWei, 'article price must be ' + articlePriceWei);
        })
    })
});
