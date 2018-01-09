import React from 'react';
import PropTypes from 'prop-types';

const SellArticle = () => (
    // todo
    <button className="button is-primary is-fullwidth">
        Sell Your Article
    </button>
);

SellArticle.propTypes = {
    sellArticle: PropTypes.func
};

export default SellArticle;
