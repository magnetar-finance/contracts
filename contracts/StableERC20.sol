pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StableERC20 is ERC20 {
    constructor(string memory name_, string memory symbol_, uint256 amount) ERC20(name_, symbol_) {
        _mint(msg.sender, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
}
