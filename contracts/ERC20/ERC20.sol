// SPDX-License-Identifier: MIT
// pragma solidity ^0.5.1;
pragma solidity ^0.6.0;

import "@nomiclabs/buidler/console.sol";

import "./SafeMath.sol";

contract ERC20 {

    using SafeMath for uint256;
    mapping(address => uint256) balances;
    uint256 totalbalance;

    function deposit( uint256 _value ) public returns ( bool ){
        require( _value > 0, "Err deposit invalid arg");
        balances[msg.sender] = balances[msg.sender].add(_value);
        totalbalance = totalbalance.add( _value );
        return true;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);

        return true;
    }

    function getBalance( ) public view returns ( uint256 ){

        // console.log("UsrAdd @ %s Bal %s", msg.sender, balances[ msg.sender ]);
        return balances[ msg.sender ];

    }

    function closeContract( address payable _owner ) public {
        selfdestruct( _owner );
    }

}