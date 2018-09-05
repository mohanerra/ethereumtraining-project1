pragma solidity ^0.4.6;

contract Splitter {
    // address public bob;
    // address public carol;
    address public owner;
    mapping(address => uint) public splittedAmountMap;
    uint public contractShare;

    constructor () public {
        // require(_bob > 0);
        // require(_carol > 0);
        owner = msg.sender;
        // bob = _bob;
        // carol = _carol;

    }

    function split(address receiver1, address receiver2) public payable returns(bool success) {
        // if( msg.sender != owner) {
        //     revert("Sender is not the owner");
        // }
        require(receiver1 > 0);
        require(receiver2 > 0);

        uint splittedHalfAmount;

        if(msg.value % 2 == 0) {
            splittedHalfAmount = msg.value / 2;
            splittedAmountMap[receiver1] += splittedHalfAmount;
            splittedAmountMap[receiver2] += splittedHalfAmount;
        } else {
            splittedHalfAmount = (msg.value - 1) / 2;
            splittedAmountMap[receiver1] += splittedHalfAmount;
            splittedAmountMap[receiver2] += splittedHalfAmount;
            contractShare += 1;
        }

        return true;
    }

    function withdrawFunds() public payable returns(bool success) {
        uint amountToTransfer = 0;

        if(splittedAmountMap[msg.sender] > 0) {
            amountToTransfer = splittedAmountMap[msg.sender];
            splittedAmountMap[msg.sender] = 0;
            msg.sender.transfer(amountToTransfer);
        } else if(msg.sender == owner) {
            if(contractShare > 0) {
                amountToTransfer = contractShare;
                contractShare = 0;
                owner.transfer(amountToTransfer);
            } else {
                revert("Does not have funds to withdraw");
            }            
        } else {
            revert("Does not have funds to withdraw");
        }

        return true;
    }

    function geSplittedAmount(address _address) public view returns(uint amount) {
        require(_address > 0, "must provide a valid address to lookup");
        return splittedAmountMap[_address];
    }
}