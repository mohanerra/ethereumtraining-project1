pragma solidity ^0.4.6;

contract Splitter {
    address public bob;
    address public carol;
    address public owner;
    mapping(address => uint) public splittedAmountMap;
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
            splittedAmountMap[bob] += splittedHalfAmount;
            splittedAmountMap[carol] += splittedHalfAmount;
        } else {
            splittedHalfAmount = (msg.value - 1) / 2;
            splittedAmountMap[bob] += splittedHalfAmount;
            splittedAmountMap[carol] += splittedHalfAmount;
            contractShare += 1;
        }

        return true;
    }

    function withdrawFunds() public payable returns(bool success) {
        uint amountToTransfer = 0;
        if(msg.sender == bob) {
            if(splittedAmountMap[bob] > 0) {
                amountToTransfer = splittedAmountMap[bob];
                splittedAmountMap[bob] = 0;
                bob.transfer(amountToTransfer);
            } else {
                revert("Does not have funds to withdraw");
            }
        } else if(msg.sender == carol) {
            if(splittedAmountMap[carol] > 0) {
                amountToTransfer = splittedAmountMap[carol];
                splittedAmountMap[carol] = 0;
                carol.transfer(amountToTransfer);
            } else {
                revert("Does not have funds to withdraw");
            }
        } else if(msg.sender == owner) {
            if(contractShare > 0) {
                amountToTransfer = contractShare;
                contractShare = 0;
                owner.transfer(amountToTransfer);
            } else {
                revert("Does not have funds to withdraw");
            }            
        } else {
            revert("un-recognized Sender");
        }
        return true;
    }

    function getContractShare() public view returns(uint cshare) {
        return contractShare;
    }

    function geSplittedAmount(address _address) public view returns(uint amount) {
        require(_address > 0, "must provide a valid address to lookup");
        return splittedAmountMap[_address];
    }
}