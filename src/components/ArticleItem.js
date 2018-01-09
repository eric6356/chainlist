import React from "react";
import {Account, Article} from "../types";
import {compareAccount} from "../utils";

const ArticleItem = ({article, currentAccount, web3, buyArticle}) => {
    const sellerAddress = compareAccount(article.seller, currentAccount) ? 'You' : article.seller.address;
    let buyerAddress = compareAccount(article.buyer, currentAccount) ? 'You' : article.buyer && article.buyer.address;
    if (parseInt(buyerAddress, 16) === 0) {
        buyerAddress = 'No buyer yet'
    }

    const canBuy = sellerAddress !== 'You' && buyerAddress === 'No buyer yet';
    const footerItem = canBuy ? (<a className="card-footer-item" onClick={() => buyArticle(article.id)}>Buy</a>) : null;

    return (
        <div className="card is-fullwidth" style={{marginBottom: "20px"}}>
            <header className="card-header">
                <div className="card-header-title" style={{whiteSpace: "nowrap", overflowX: "hidden"}}>{article.name}</div>
            </header>
            <div className="card-content">
                <div className="content">
                    <dl>
                        <dt>Description</dt>
                        <dd>{article.description}</dd>
                        <dt>Price</dt>
                        <dd>{web3.utils.fromWei(article.price.toString(), "ether")} ETH</dd>
                        <dt>Seller</dt>
                        <dd>{sellerAddress}</dd>
                        <dt>Buyer</dt>
                        <dd>{buyerAddress}</dd>
                    </dl>
                </div>
            </div>
            <footer className="card-footer">
                {footerItem}
            </footer>
        </div>
    );
};

ArticleItem.propTypes = {
    article: Article,
    currentAccount: Account
};

export default ArticleItem;