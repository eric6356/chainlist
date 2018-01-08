// Contract to be tested
var ChainList = artifacts.require('./ChainList.sol');

// Test suit
contract('ChainList', function (accounts) {
     var chainListInstance;
     var seller = accounts[1];
     var buyer = accounts[2];
     var articleName1 = 'article 1';
     var articleName2 = 'article 2';
     var articleDescription1 = 'Description for article 1';
     var articleDescription2 = 'Description for article 2';
     var articlePrice1 = 10;
     var articlePrice2 = 20;
     var articlePriceWei1 = web3.toWei(articlePrice1, 'ether');
     var articlePriceWei2 = web3.toWei(articlePrice2, 'ether');
     var buyerBalanceBeforeBuy, buyerBalanceAfterBuy;
     var sellerBalanceBeforeBuy, sellerBalanceAfterBuy;
     var articleId;

    // Test case: check initial values
    it('should be initialized with empty values', function () {
        return ChainList.deployed().then(function (instance) {
            chainListInstance = instance;
            return instance.getNumberOfArticles();
        }).then(function (data) {
            assert.equal(data, 0, 'number of articles should be 0');
            return chainListInstance.getArticlesForSale();
        }).then(function (data) {
            assert.equal(data.length, 0, 'must be 0 article for sale');
        })
    });

    // Test case: sell an article
    it('should sell an article', function () {
        return ChainList.deployed().then(function (instance) {
            chainListInstance = instance;
            return chainListInstance.sellArticle(
                articleName1,
                articleDescription1,
                articlePriceWei1,
                {from: seller}
            )
        }).then(function (receipt) {
            // check event
            assert.equal(receipt.logs.length, 1, 'should have received one event');
            assert.equal(receipt.logs[0].event, 'sellArticleEvent', 'event should be sellArticleEvent');
            assert.equal(receipt.logs[0].args._id.toNumber(), 1, 'id must be 1');
            assert.equal(receipt.logs[0].args._seller, seller, 'seller must be ' + seller);
            assert.equal(receipt.logs[0].args._name, articleName1, 'article name must be ' + articleName1);
            assert.equal(receipt.logs[0].args._price.toNumber(), articlePriceWei1, 'article price must be ' + articlePriceWei1);
            return chainListInstance.getNumberOfArticles();
        }).then(function (data) {
            assert.equal(data, 1, 'there must now be 1 article');

            return chainListInstance.getArticlesForSale();
        }).then(function (data) {
            assert(data.length, 1, 'there must now be 1 article for sale');
            articleId = data[0].toNumber();
            assert(articleId, 1, 'articleId must be 1');

            return chainListInstance.articles(articleId);
        }).then(function (data) {
            assert.equal(data[0].toNumber(), 1, 'article id must be 1');
            assert.equal(data[1], seller, 'seller must be ' + seller);
            assert.equal(data[2], 0x0, 'buyer must be empty');
            assert.equal(data[3], articleName1, 'article name must be ' + articleName1);
            assert.equal(data[4], articleDescription1, 'article description must be ' + articleDescription1);
            assert.equal(data[5], articlePriceWei1, 'article price must be ' + articlePriceWei1);
        })
    });

    // Test case: sell second article
    it('should sell the second article', function () {
        return ChainList.deployed().then(function (instance) {
            chainListInstance = instance;
            return chainListInstance.sellArticle(
                articleName2,
                articleDescription2,
                articlePriceWei2,
                {from: seller}
            )
        }).then(function (receipt) {
            // check event
            assert.equal(receipt.logs.length, 1, 'should have received one event');
            assert.equal(receipt.logs[0].event, 'sellArticleEvent', 'event should be sellArticleEvent');
            assert.equal(receipt.logs[0].args._id.toNumber(), 2, 'id must be 2');
            assert.equal(receipt.logs[0].args._seller, seller, 'seller must be ' + seller);
            assert.equal(receipt.logs[0].args._name, articleName2, 'article name must be ' + articleName2);
            assert.equal(receipt.logs[0].args._price.toNumber(), articlePriceWei2, 'article price must be ' + articlePriceWei2);
            return chainListInstance.getNumberOfArticles();
        }).then(function (data) {
            assert.equal(data, 2, 'there must now be 2 article');

            return chainListInstance.getArticlesForSale();
        }).then(function (data) {
            assert(data.length, 2, 'there must now be 2 article for sale');
            articleId = data[1].toNumber();
            assert(articleId, 2, 'articleId must be 1');

            return chainListInstance.articles(articleId);
        }).then(function (data) {
            assert.equal(data[0].toNumber(), 2, 'article id must be 2');
            assert.equal(data[1], seller, 'seller must be ' + seller);
            assert.equal(data[2], 0x0, 'buyer must be empty');
            assert.equal(data[3], articleName2, 'article name must be ' + articleName2);
            assert.equal(data[4], articleDescription2, 'article description must be ' + articleDescription2);
            assert.equal(data[5], articlePriceWei2, 'article price must be ' + articlePriceWei2);
        })
    });

    // Test case: buy the first article
    it('should let use buy the first article', function () {
        return ChainList.deployed().then(function (instance) {
            chainListInstance = instance;
            articleId = 1;

            //record balances of seller and buyer before buy
            sellerBalanceBeforeBuy = web3.fromWei(web3.eth.getBalance(seller)).toNumber();
            buyerBalanceBeforeBuy = web3.fromWei(web3.eth.getBalance(buyer)).toNumber();

            return chainListInstance.buyArticle(articleId, {from: buyer, value: articlePriceWei1});
        }).then(function (receipt) {
            assert.equal(receipt.logs.length, 1, 'one event should have been triggered');
            assert.equal(receipt.logs[0].event, 'buyArticleEvent', 'event should be buyArticleEvent');
            assert.equal(receipt.logs[0].args._id.toNumber(), articleId, 'articleId must be ' + articleId);
            assert.equal(receipt.logs[0].args._seller, seller, 'seller must be ' + seller);
            assert.equal(receipt.logs[0].args._buyer, buyer, 'buyer must be ' + buyer);
            assert.equal(receipt.logs[0].args._name, articleName1, 'article name must be ' + articleName1);
            assert.equal(receipt.logs[0].args._price.toNumber(), articlePriceWei1, 'article price must be ' + articlePriceWei1);

            // record balance after buy
            sellerBalanceAfterBuy = web3.fromWei(web3.eth.getBalance(seller)).toNumber();
            buyerBalanceAfterBuy = web3.fromWei(web3.eth.getBalance(buyer)).toNumber();

            // check the effect of buy on balances of buyer and seller, accounting for gas
            assert(sellerBalanceAfterBuy === sellerBalanceBeforeBuy + articlePrice1, 'seller should have earned ' + articlePrice1 + ' ETH');
            assert(buyerBalanceAfterBuy <= buyerBalanceBeforeBuy - articlePrice1, 'buyer should spend at least ' + articlePrice1 + ' ETH');

            return chainListInstance.articles(articleId);
        }).then(function (data) {
            assert.equal(data[0].toNumber(), 1, 'article id must be 1');
            assert.equal(data[1], seller, 'seller must be ' + seller);
            assert.equal(data[2], buyer, 'buyer must be ' + buyer);
            assert.equal(data[3], articleName1, 'article name must be ' + articleName1);
            assert.equal(data[4], articleDescription1, 'article description must be ' + articleDescription1);
            assert.equal(data[5].toNumber(), articlePriceWei1, 'article price must be ' + articlePriceWei1);

            return chainListInstance.getArticlesForSale();
        }).then(function (data) {
            assert(data.length, 1, 'there should now be only 1 article left for sale');
        })
    })

//     // Test case: buy an article after the seller article case
//     it('should buy an article', function () {
//         return ChainList.deployed().then(function (instance) {
//             chainListInstance = instance;
//
//             // record balance before buy
//             sellerBalanceBeforeBuy = web3.fromWei(web3.eth.getBalance(seller)).toNumber();
//             buyerBalanceBeforeBuy = web3.fromWei(web3.eth.getBalance(buyer)).toNumber();
//
//             return chainListInstance.buyArticle({from: buyer, value: articlePriceWei});
//         }).then(function (receipt) {
//             assert.equal(receipt.logs.length, 1, 'one event should be triggered');
//             assert.equal(receipt.logs[0].event, 'buyArticleEvent', 'event should be buyArticleEvent');
//             assert.equal(receipt.logs[0].args._seller, seller, 'event seller must be ' + seller);
//             assert.equal(receipt.logs[0].args._buyer, buyer, 'event buyer must be ' + buyer);
//             assert.equal(receipt.logs[0].args._name, articleName, 'event name must be ' + articleName);
//             assert.equal(receipt.logs[0].args._price, articlePriceWei, 'event price must be ' + articlePriceWei);
//
//             // record balance after buy
//             sellerBalanceAfterBuy = web3.fromWei(web3.eth.getBalance(seller)).toNumber();
//             buyerBalanceAfterBuy = web3.fromWei(web3.eth.getBalance(buyer)).toNumber();
//
//             // check the effect of buy on balances of buyer and seller, accounting for gas
//             assert(sellerBalanceAfterBuy === sellerBalanceBeforeBuy + articlePrice, 'seller should have earned ' + articlePrice + 'ETH');
//             assert(buyerBalanceAfterBuy <= buyerBalanceBeforeBuy - articlePrice, 'buyer should spend at least ' + articlePrice + 'ETH');
//
//             return chainListInstance.getArticle.call();
//         }).then(function (data) {
//             assert.equal(data[0], seller, 'seller must be ' + seller);
//             assert.equal(data[1], buyer, 'buyer must be ' + buyer);
//             assert.equal(data[2], articleName, 'article name must be ' + articleName);
//             assert.equal(data[3], articleDescription, 'article description must be ' + articleDescription);
//             assert.equal(data[4].toNumber(), articlePriceWei, 'article price must be ' + articlePriceWei);
//         });
//     })
});
