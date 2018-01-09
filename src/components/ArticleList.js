import React from 'react';
import PropTypes from 'prop-types';
import {Account, Article} from "../types";
import {connect} from "react-redux";
import ArticleItem from "./ArticleItem";
import {buyArticle} from "../actions";

const ArticleList = (props) => {
    const {articles} = props;
    return (
        <div>
            {articles.map((article, i) => <ArticleItem key={i} {...props} article={article} />)}
        </div>
    );
}

ArticleList.propTypes = {
    articles: PropTypes.arrayOf(Article),
    currentAccount: Account,
};

export default connect(
    state => state,
    dispatch => ({
        buyArticle: articleId => dispatch(buyArticle(articleId))
    })
)(ArticleList);
