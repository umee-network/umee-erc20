// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @dev Custom error thrown when the provided amount is less then zero.
 */
error InvalidAmount();

/**
 * @dev Custom error thrown when the provided amount is less then zero.
 */
error MaxSupplyReached();

contract UmeeTokenMigrator is ReentrancyGuard, Ownable {
    address public deadAddress = 0x000000000000000000000000000000000000dEaD;
    address public gravityBridgeUmee;
    address public axelarToken;
    uint256 public tokensTransfered = 0;

    /**
     * @dev Emitted when a Gravity Bridge token swap occurs.
     * @param user The address of the user who initiated the swap.
     * @param amount The amount of tokens swapped.
     */
    event SwapGB(address indexed user, uint256 amount);

    event EmergencyWithdraw(address indexed owner, uint256 amount);

    /**
     * @dev Initializes the contract with the provided parameters.
     * @param _gravityBridgeUmee The address of the Gravity Bridge Umee token contract.
     */
    constructor(address _gravityBridgeUmee, address _axelarToken) {
        gravityBridgeUmee = _gravityBridgeUmee;
        axelarToken = _axelarToken;
    }

    /**
     * @dev Swaps Deprecated Gravity Bridge UMEE for the new, axelar supported UMEE tokens.
     * @param amount The amount of UMEE tokens to be swapped.
     */
    function swapGB(uint256 amount) external nonReentrant {
        if (amount == 0) revert InvalidAmount();

        ERC20(gravityBridgeUmee).transferFrom(msg.sender, deadAddress, amount);

        tokensTransfered += amount;

        ERC20(axelarToken).transfer(msg.sender, amount);

        emit SwapGB(msg.sender, amount);
    }

    function emergencyWithdraw() external nonReentrant onlyOwner {
        uint256 balance = ERC20(axelarToken).balanceOf(address(this));
        ERC20(axelarToken).transfer(msg.sender, balance);

        emit EmergencyWithdraw(msg.sender, balance);
    }
}
