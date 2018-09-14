pragma solidity ^0.4.6;

import "./Pausable.sol";

contract Splitter is Pausable{

    // address public owner;
    mapping(address => uint) public balances;

    event LogSplitFunds(address sender, address receiver1, address receiver2, uint amount);
    event LogSendAmount(address sender, uint amount);

    constructor () public {
        // owner = msg.sender;

    }

    function splitFunds(address receiver1, address receiver2) public payable onlyIfRunning returns(bool success) {
        require(receiver1 > 0, "invalid receiver1 address");
        require(receiver2 > 0, "invalid receiver2 address");

        uint splittedHalfAmount = msg.value/2;
        balances[receiver1] = splittedHalfAmount;
        balances[receiver2] = splittedHalfAmount;

        emit LogSplitFunds(msg.sender, receiver1, receiver2, msg.value);

        if(msg.value % 2 > 0) {
            //send the change back to the sender
            msg.sender.transfer(1);
            emit LogSendAmount(msg.sender, 1);
        } 

        return true;
    }

    function withdrawFunds() public onlyIfRunning returns(bool success) {
        require(balances[msg.sender] > 0, "no funds to withdraw");
        uint amountToTransfer = balances[msg.sender];
        balances[msg.sender] = 0;
        msg.sender.transfer(amountToTransfer);
        emit LogSendAmount(msg.sender, amountToTransfer);
        return true;
    }

}