# Umee ERC20 Token

The new `Umee` is a Solidity smart contract designed to handle the transition of UMEE tokens from the deprecated Gravity Bridge to the new Axelar-supported token system. It facilitates the swapping of old UMEE tokens for new ones. This will then use Axelar to bridge between umee <> Ethereum and other future chains

## Features

- Swap deprecated Gravity Bridge UMEE tokens for new Axelar-supported UMEE tokens.
- Custom token decimals for display purposes (6 decimals).
- Reentrancy protection using OpenZeppelin's `ReentrancyGuard`.
- Implements the ERC20 Permit extension for gasless approvals

## Functions

- **swap(uint256 amount)**: Allows users to swap their deprecated Gravity Bridge UMEE tokens for new Axelar-supported UMEE tokens by providing the amount they want to swap.
- **decimals()**: Returns the number of decimals used for display purposes (6 decimals).

## Events

- **SwapGB(address indexed user, uint256 amount)**: Emitted when a token swap occurs, providing the address of the user who initiated the swap and the amount of tokens swapped.

## Custom Errors

- **InvalidAmount()**: Custom error thrown when the provided amount is less than or equal to zero.

- **InsufficientBalance()**: Custom error thrown when the provided amount is less than the users current balance. Unnessasary but will help give users clear error messages

- **InsufficientAllowance()**: Custom error thrown when the provided amount is less than the users approved amount. Unnessasary but will help give users more clear messages

Create a .env with ETHERSCAN_API_KEY, a PRIVATE_KEY and an RPC (ETHEREUM_RPC for Ethereum) then run the following commands. For the network flag choose from a network in the hardhat config or add a new network

## Test

```
npm i

npx hardhat node //start local fork of mainnet

npx hardhat test
```

## Live Contract:

### Goerli

New Umee: https://goerli.etherscan.io/address/0x434bc12B22844311Db37309974e82466D9C4C8Dc#code
Test GB Umee: https://goerli.etherscan.io/address/0x77D8aaFc623618d4E1a820A45D37e242054aaF05#code

## Deployment

```
npm i

npx hardhat run scripts/deploy.ts --network mainnet
```

## Dependencies

- OpenZeppelin's ERC20, IERC20, and ReentrancyGuard contracts.
