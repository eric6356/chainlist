import PropTypes from "prop-types";

export const Account = PropTypes.shape({
    address: PropTypes.string
});

export const SellEvent = PropTypes.shape({
    event: PropTypes.string,
    id: PropTypes.number,
    seller: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
});

export const BuyEvent = PropTypes.shape({
    event: PropTypes.string,
    id: PropTypes.number,
    seller: PropTypes.string,
    buyer: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
});

export const Article = PropTypes.shape({
    id: PropTypes.number,
    seller: PropTypes.string,
    buyer: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
});
