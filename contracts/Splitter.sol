pragma solidity ^0.4.6;

contract Splitter {
    address public bob;
    address public carol;
    address public owner;
    uint public contractShare;

    constructor (address _bob, address _carol) public {
        require(_bob > 0);
        require(_carol > 0);
        owner = msg.sender;
        bob = _bob;
        carol = _carol;

    }

    function split() public payable returns(bool success) {
        if( msg.sender != owner) {
            revert("Sender is not the owner");
        }

        uint splittedHalfAmount;

        if(msg.value % 2 == 0) {
            splittedHalfAmount = msg.value / 2;
        } else {
            splittedHalfAmount = (msg.value - 1) / 2;
            contractShare += 1;
        }

        bob.transfer(splittedHalfAmount);
        carol.transfer(splittedHalfAmount);

        return true;
    }

    function getContractShare() public view returns(uint cshare) {
        return contractShare;
    }
}