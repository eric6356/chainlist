import React from 'react';
import PropTypes from 'prop-types';

const SellArticle = ({sellArticle}) => (
    <button className="button is-primary is-fullwidth" onClick={sellArticle}>
        Sell Your Article
    </button>
);

SellArticle.propTypes = {
    sellArticle: PropTypes.func
};

export default SellArticle;
