App = {
    web3Provider: null,
    contracts: {},

    init: function () {
        // Load article
        var articlesRow = $('#articlesRow');
        var articleTemplate = $('#articleTemplate');

        articleTemplate.find('.panel-title').text('article one');
        articleTemplate.find('.article-description').text('Description for this article');
        articleTemplate.find('.article-price').text('10.23');
        articleTemplate.find('.article-seller').text('');

        articlesRow.append(articleTemplate.html());

        return App.initWeb3();
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
