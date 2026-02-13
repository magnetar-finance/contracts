pragma solidity ^0.8.0;

import {IWETH} from "./interfaces/IWETH.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract WETH is IWETH, ERC20 {
    event Deposit(address indexed depositor, uint256 value);
    event Withdrawal(address indexed withdrawer, uint256 value);

    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {}

    function deposit() public payable {
        _mint(msg.sender, msg.value);
        emit Deposit(msg.sender, msg.value);
    }
    function withdraw(uint wad) public {
        require(balanceOf(msg.sender) >= wad);
        _burn(msg.sender, wad);
        payable(msg.sender).transfer(wad);
        emit Withdrawal(msg.sender, wad);
    }

    receive() external payable {
        deposit();
    }
}
