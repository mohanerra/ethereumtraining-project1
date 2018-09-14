pragma solidity ^0.4.6;

import "./Owned.sol";

contract Pausable is Owned {

    bool public running;

    modifier onlyIfRunning {require(running == true, "cannot execute now"); _;}

    constructor()  public {
        running = true;
    }

    function runSwitch(bool onOff) public onlyOwner returns(bool success) {
        running = onOff;
        return true;
    }


}