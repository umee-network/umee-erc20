# UmeeAxelarToken

`UmeeAxelarToken` is a Solidity smart contract designed to handle the transition of UMEE tokens from the deprecated Gravity Bridge to the new Axelar-supported token system. It facilitates the swapping of old UMEE tokens for new ones and allows bridging tokens between the Ethereum chain and the Umee Cosmos Chain.

## Features

- Swap deprecated Gravity Bridge UMEE tokens for new Axelar-supported UMEE tokens.
- Bridge UMEE tokens between Ethereum and Umee Cosmos Chain.
- Custom token decimals for display purposes (6 decimals).
- Reentrancy protection using OpenZeppelin's `ReentrancyGuard`.
- Integration with Axelar Gateway and Axelar Gas Service.

## Functions

- **swap(uint256 amount)**: Allows users to swap their deprecated Gravity Bridge UMEE tokens for new Axelar-supported UMEE tokens by providing the amount they want to swap.
- **bridge(string destinationChain, string destinationAddress, string receiverAddress, uint256 amount)**: Facilitates bridging of UMEE tokens between the Ethereum chain and the Umee Cosmos Chain by providing the destination chain, destination address, receiver address, and amount of tokens to be bridged.
- **decimals()**: Returns the number of decimals used for display purposes (6 decimals).

## Events

- **Swap(address indexed user, uint256 amount)**: Emitted when a token swap occurs, providing the address of the user who initiated the swap and the amount of tokens swapped.

## Custom Errors

- **InvalidAmount()**: Custom error thrown when the provided amount is less than or equal to zero.

## Dependencies

- OpenZeppelin's ERC20, IERC20, and ReentrancyGuard contracts.
- Axelar's AxelarExecutable, IAxelarGateway, and IAxelarGasService contracts.
