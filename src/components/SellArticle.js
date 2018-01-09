import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import classNames from 'classnames';

import { sellArticle } from "../actions";

class SellArticle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsActive: false,
            name: '',
            price: '',
            description: ''
        };

        this.showModal = this.toggleModal.bind(this, true);
        this.hideModal = this.toggleModal.bind(this, false);
        this.handleChange = this.handleChange.bind(this);
        this.sellArticle = this.sellArticle.bind(this);
    }

    toggleModal(flag) {
        this.setState(state => ({...state, modalIsActive: flag}));
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState(state => ({...state, [name]: value}));
    }

    sellArticle() {
        const price = this.props.web3.utils.toWei(this.state.price, 'ether');
        const name = this.state.name.trim();
        const description = this.state.description.trim();

        if (name === '' || price === 0) {
            return
        }

        this.props.dispatch(sellArticle({name, price, description}));
    }

    render() {
        return (
            <div>
                <button className="button is-primary is-fullwidth" onClick={this.showModal}>
                    Sell Your Article
                </button>
                <div className={classNames("modal", {"is-active": this.state.modalIsActive})}>
                    <div className="modal-background" onClick={this.hideModal}/>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Sell Your Article</p>
                            <button className="delete" onClick={this.hideModal}/>
                        </header>
                        <section className="modal-card-body">
                            <div className="field">
                                <label className="label">Name</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder="Enter the name of your article"
                                        name="name"
                                        value={this.state.name}
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Price</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        type="number"
                                        placeholder="Price in ETH"
                                        pattern="[0-9]+([\.,][0-9]+)?"
                                        name="price"
                                        value={this.state.price}
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Description</label>
                                <div className="control">
                                    <textarea
                                        className="textarea"
                                        placeholder="Describe your article"
                                        maxLength="255"
                                        name="description"
                                        value={this.state.description}
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                        </section>
                        <footer className="modal-card-foot">
                            <button className="button is-primary is-pulled-right" onClick={this.sellArticle}>Submit</button>
                            <button className="button" onClick={this.hideModal}>Cancel</button>
                        </footer>
                    </div>
                </div>
            </div>
        )
    }
}
SellArticle.propTypes = {
    showingModal: PropTypes.string
};

export default connect(
    state => state,
    dispatch => ({dispatch})
)(SellArticle);
