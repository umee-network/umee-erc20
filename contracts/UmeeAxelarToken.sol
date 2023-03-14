// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executables/AxelarExecutable.sol";
import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";

/**
 * @dev Custom error thrown when the provided amount is less then zero.
 */
error InvalidAmount();

contract UmeeAxelarToken is ERC20Permit, AxelarExecutable, ReentrancyGuard {
    IAxelarGasService public immutable gasReceiver;

    address public deadAddress = 0x000000000000000000000000000000000000dEaD;
    address public gravityBridgeUmee;
    uint256 public tokensSwapped = 0;

    /**
     * @dev Emitted when a Gravity Bridge token swap occurs.
     * @param user The address of the user who initiated the swap.
     * @param amount The amount of tokens swapped.
     */
    event SwapGB(address indexed user, uint256 amount);

    /**
     * @dev Initializes the contract with the provided parameters.
     * @param _gravityBridgeUmee The address of the Gravity Bridge Umee token contract.
     * @param _gateway The address of the Axelar Gateway contract.
     * @param _gasReceiver The address of the Axelar Gas Service contract.
     */
    constructor(
        address _gravityBridgeUmee,
        address _gateway,
        address _gasReceiver
    ) ERC20("UMEE", "UMEE") AxelarExecutable(_gateway) {
        gasReceiver = IAxelarGasService(_gasReceiver);
        gravityBridgeUmee = _gravityBridgeUmee;
    }

    /**
     * @dev Swaps Deprecated Gravity Bridge UMEE for the new, axelar supported UMEE tokens.
     * @param amount The amount of UMEE tokens to be swapped.
     */
    function swapGB(uint256 amount) public nonReentrant {
        if (amount == 0) revert InvalidAmount();

        ERC20(gravityBridgeUmee).transferFrom(msg.sender, deadAddress, amount);

        tokensSwapped += amount;

        _mint(msg.sender, amount);
        emit SwapGB(msg.sender, amount);
    }

    /**
     * @dev Bridges UMEE tokens from current chain to the Umee Cosmos Chain
     * @param destinationChain The destination chain
     * @param destinationAddress The destination address on the other chain.
     * @param receiverAddress The receiver address on the other chain.
     * @param amount The amount of UMEE tokens to be bridged.
     */
    function bridge(
        string memory destinationChain,
        string memory destinationAddress,
        string memory receiverAddress,
        uint256 amount
    ) external payable {
        if (amount == 0) revert InvalidAmount();
        string memory symbol = "umee";

        address tokenAddress = gateway.tokenAddresses(symbol);
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
        IERC20(tokenAddress).approve(address(gateway), amount);

        bytes memory payload = abi.encode(receiverAddress);

        // optional pay gas service
        if (msg.value > 0) {
            gasReceiver.payNativeGasForContractCallWithToken{value: msg.value}(
                address(this),
                destinationChain,
                destinationAddress,
                payload,
                symbol,
                amount,
                msg.sender
            );
        }

        gateway.callContractWithToken(
            destinationChain,
            destinationAddress,
            payload,
            symbol,
            amount
        );
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei. This is the value {ERC20} uses, unless this function is
     * overridden;
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * {IERC20-balanceOf} and {IERC20-transfer}.
     */
    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
}
