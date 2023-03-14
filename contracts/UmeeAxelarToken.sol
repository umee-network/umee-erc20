// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executables/AxelarExecutable.sol";
import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";

error InvalidAmount();

contract UmeeAxelarToken is ERC20, AxelarExecutable, ReentrancyGuard {
    IAxelarGasService public immutable gasReceiver;

    address public gravityBridgeUmee;
    uint256 tokensSwapped = 0;

    event Swap(address indexed user, uint256 amount);

    constructor(
        address _gravityBridgeUmee,
        address _gateway,
        address _gasReceiver
    ) ERC20("UMEE", "UMEE") AxelarExecutable(_gateway) {
        gasReceiver = IAxelarGasService(_gasReceiver);
        gravityBridgeUmee = _gravityBridgeUmee;
    }

    function swap(uint256 amount) public nonReentrant {
        if (amount == 0) revert InvalidAmount();

        ERC20(gravityBridgeUmee).transferFrom(msg.sender, address(0), amount);

        tokensSwapped += amount;

        _mint(msg.sender, amount);
        emit Swap(msg.sender, amount);
    }

    function bridge(
        string memory destinationChain,
        string memory destinationAddress,
        string memory receiverAddress,
        string memory symbol,
        uint256 amount
    ) external payable {
        if (amount == 0) revert InvalidAmount();

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
