pragma solidity ^0.4.2;

contract ChainList {
    // Custom types
    struct Article {
        uint id;
        address seller;
        address buyer;
        string name;
        string description;
        uint256 price;
    }

    // State variables
    mapping(uint => Article) public articles;
    uint articleCounter;
    address owner;

    // Events
    event sellArticleEvent(
        uint indexed _id,
        address indexed _seller,
        string _name,
        uint256 _price
    );
    event buyArticleEvent(
        uint indexed _id,
        address indexed _seller,
        address indexed _buyer,
        string _name,
        uint256 _price
    );

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;  // placeholder of the modified code block
    }

    // constructor
    function ChainList() {
        owner = msg.sender;
    }

    // sell an article
    function sellArticle(string _name, string _description, uint256 _price) public {
        articleCounter++;

        articles[articleCounter] = Article(
            articleCounter,
            msg.sender,
            0x0,
            _name,
            _description,
            _price
        );

        sellArticleEvent(articleCounter, msg.sender, _name, _price);
    }

    // fetch the number of articles in the contract
    function getNumberOfArticles() public constant returns (uint) {
        return articleCounter;
    }

    // fetch and returns all article IDs available for sale
    function getArticlesForSale() public constant returns (uint[]) {
        if (articleCounter == 0) {
            return new uint[](0);
        }

        // prepare output arrays
        uint[] memory articleIds = new uint[](articleCounter);

        uint numberOfArticlesForSale = 0;
        for (uint i = 1; i <= articleCounter; i++) {
            if (articles[i].buyer == 0x0) {
                articleIds[numberOfArticlesForSale] = articles[i].id;
                numberOfArticlesForSale++;
            }
        }

        // copy result to smaller array
        uint[] memory forSale = new uint[](numberOfArticlesForSale);
        for (i = 0; i < numberOfArticlesForSale; i++) {
            forSale[i] = articleIds[i];
        }
        return forSale;
    }

    // buy an article
    function buyArticle(uint _id) payable public {
        // there should be at least 1 article
        require(articleCounter > 0);

        // the article should exist
        require(_id > 0 && _id <= articleCounter);

        // retrieve the article
        Article storage article = articles[_id];

        // should not be sold
        require(article.buyer == 0x00);

        // you cannot by your own article
        require(msg.sender != article.seller);

        // the value send transacted corresponds to the article price
        require(msg.value == article.price);

        // keep the buyer's information
        article.buyer = msg.sender;

        // the buyer can buy the article
        article.seller.transfer(msg.value);

        //trigger event
        buyArticleEvent(_id, article.seller, article.buyer, article.name, article.price);
    }

    // kill the smart contract
    function kill() onlyOwner {
        selfdestruct(owner);
    }
}
