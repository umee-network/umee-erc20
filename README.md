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

## Test

Cross chain testing is made easy using axelars tool: https://xchainbox.axelar.dev/

Testnet Addresses: https://docs.axelar.dev/dev/reference/testnet-contract-addresses

```
npm i

npx hardhat node //start local fork of mainnet

npx hardhat test
```

## Live Contract:

### Goerli

New Umee: https://goerli.etherscan.io/address/0x8db0e836aa049ED0E0c6cbdc6109b154eab813B3#code
Test GB Umee: https://goerli.etherscan.io/address/0x080DF11a53555FeA2c31f76a2C6b45688a1fC756#code

## Deployment

create a .env with ETHERSCAN_API_KEY, a PRIVATE_KEY and an RPC (ETHEREUM_RPC for Ethereum) then run the following commands. For the network flag choose from a network in the hardhat config or add a new network

```
npm i

npx hardhat run scripts/deploy.ts --network mainnet
```

## Dependencies

- OpenZeppelin's ERC20, IERC20, and ReentrancyGuard contracts.
- Axelar's AxelarExecutable, IAxelarGateway, and IAxelarGasService contracts.
