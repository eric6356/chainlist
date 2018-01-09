import PropTypes from "prop-types";

export const Account = PropTypes.shape({
    address: PropTypes.string
});

export const Event = PropTypes.shape({
    event: PropTypes.string,
    id: PropTypes.number,
    seller: Account,
    buyer: Account,
    name: PropTypes.string,
    price: PropTypes.number,
});

export const Article = PropTypes.shape({
    id: PropTypes.number,
    seller: PropTypes.string,
    buyer: Account,
    name: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
});
