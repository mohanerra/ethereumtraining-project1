pragma solidity ^0.4.6;

contract Splitter {

    address public owner;
    mapping(address => uint) public balances;

    constructor () public {
        owner = msg.sender;

    }

    function split(address receiver1, address receiver2) public payable returns(bool success) {
        require(receiver1 > 0, "invalid receiver1 address");
        require(receiver2 > 0, "invalid receiver2 address");

        uint splittedHalfAmount = msg.value/2;
        balances[receiver1] = splittedHalfAmount;
        balances[receiver2] = splittedHalfAmount;

        if(msg.value % 2 > 0) {
            //send the change back to the sender
            msg.sender.transfer(1);
        } 

        return true;
    }

    function withdrawFunds() public returns(bool success) {
        require(balances[msg.sender] > 0, "no funds to withdraw");
        uint amountToTransfer = balances[msg.sender];
        balances[msg.sender] = 0;
        msg.sender.transfer(amountToTransfer);

        return true;
    }

}