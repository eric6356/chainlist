pragma solidity ^0.4.2;

contract ChainList {
    // State variables
    address seller;
    address buyer;
    string name;
    string description;
    uint256 price;

    // Events
    event sellArticleEvent(address indexed _seller, string _name, uint256 _price);
    event buyArticleEvent(address indexed _seller, address indexed _buyer, string _name, uint256 _price);

    // sell an article
    function sellArticle(string _name, string _description, uint256 _price) public {
        seller = msg.sender;
        name = _name;
        description = _description;
        price = _price;
        sellArticleEvent(seller, name, price);
    }

    // get the article
    function getArticle() public constant returns (
        address _seller,
        address _buyer,
        string _name,
        string _description,
        uint256 _price) {
        return (seller, buyer, name, description, price);
    }

    // buy an article
    function buyArticle() payable public {
        // should be ready for sale
        require(seller != 0x00);

        // should not be sold
        require(buyer == 0x00);

        // you cannot by your own article
        require(msg.sender != seller);

        // the value send transacted corresponds to the article price
        require(msg.value == price);

        // keep the buyer's information
        buyer = msg.sender;

        // the buyer can buy the article
        seller.transfer(msg.value);

        //trigger event
        buyArticleEvent(seller, buyer, name, price);
    }
}
