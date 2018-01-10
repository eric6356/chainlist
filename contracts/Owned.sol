pragma solidity ^0.4.0;

contract Owned {
    // State variables
    address owner;

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // constructor
    function Owned() public {
        owner = msg.sender;
    }
}
