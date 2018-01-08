import React from 'react';
import PropTypes from 'prop-types';
import {Account, Article} from "../types";

const ArticleList = ({articles, currentAccount}) => (
    // todo
    <div>ArticleList</div>
);

ArticleList.propTypes = {
    articles: PropTypes.arrayOf(Article),
    currentAccount: Account,
};

export default ArticleList;
