// SPDX-License-Identifier: MIT
// pragma solidity ^0.5.1;
pragma solidity ^0.6.0;

import "@nomiclabs/buidler/console.sol";

contract FibonacciBalance {
    address public fibonacciLibrary;

    // the current fibonacci number to withdraw
    uint public calculatedFibNumber;

    // the starting fibonacci sequence number
    uint public start = 3;
    uint public withdrawalCounter;

    // constructor - loads the contract with ether
    constructor(address _fibonacciLibrary) public payable {
        fibonacciLibrary = _fibonacciLibrary;
    }

    function withdraw() public {
        withdrawalCounter += 1;
        bool status;
        bytes memory _data;
        bytes memory _funarg;
        // calculate the fibonacci number for the current withdrawal user
        // this sets calculatedFibNumber

        _funarg = abi.encodeWithSignature("setStart(uint)", start);

        ( status, _data ) = fibonacciLibrary.delegatecall( _funarg );

        require( status, "Err@FibboBal::withdraw failed in Delegatecall-1");

        _funarg = abi.encodeWithSignature("setFibonacci(uint)", withdrawalCounter);

        ( status, _data ) = fibonacciLibrary.delegatecall( _funarg );

        require( status, "Err@FibboBal::withdraw failed in Delegatecall-2" );

        calculatedFibNumber = abi.decode( _data, (uint256));

        msg.sender.transfer(calculatedFibNumber * 1 ether);
    }

    // allow users to call fibonacci library functions
    fallback() external {

        bool status;
        bytes memory _data;

        ( status, _data ) = fibonacciLibrary.delegatecall( msg.data );

        require( status, "Err@fallback failed in Delegatecall");
    }

    function withdrawEth() public {
        msg.sender.transfer( address(this).balance );
    }

}