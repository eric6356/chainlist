import Web3 from 'web3';

const web3 = new Web3("http://localhost:9545");
export default (state = {web3}, action) => {
    switch (action.type) {
        default:
            return state
    }
};
