pragma solidity ^0.4.6;

contract Owned {

    address public owner;

    modifier onlyOwner {require(msg.sender == owner, "Only owner can execute this"); _;}
    
    constructor () public {
        owner = msg.sender;
    }   

}