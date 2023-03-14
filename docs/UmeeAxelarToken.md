# UmeeAxelarToken

Replacing the current Gravity Bridge Umee ERC20 token with an ERC20 Token bridged through Axelar's General Message Passing

## Methods

### allowance

```solidity
function allowance(address owner, address spender) external view returns (uint256)
```

_See {IERC20-allowance}._

#### Parameters

| Name    | Type    | Description |
| ------- | ------- | ----------- |
| owner   | address | undefined   |
| spender | address | undefined   |

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### approve

```solidity
function approve(address spender, uint256 amount) external nonpayable returns (bool)
```

_See {IERC20-approve}. NOTE: If `amount` is the maximum `uint256`, the allowance is not updated on `transferFrom`. This is semantically equivalent to an infinite approval. Requirements: - `spender` cannot be the zero address._

#### Parameters

| Name    | Type    | Description |
| ------- | ------- | ----------- |
| spender | address | undefined   |
| amount  | uint256 | undefined   |

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

### balanceOf

```solidity
function balanceOf(address account) external view returns (uint256)
```

_See {IERC20-balanceOf}._

#### Parameters

| Name    | Type    | Description |
| ------- | ------- | ----------- |
| account | address | undefined   |

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### bridge

```solidity
function bridge(string destinationAddress, string receiverAddress, uint256 amount) external payable
```

_Bridges UMEE tokens from current chain to the Umee Cosmos Chain_

#### Parameters

| Name               | Type    | Description                                 |
| ------------------ | ------- | ------------------------------------------- |
| destinationAddress | string  | The destination address on the other chain. |
| receiverAddress    | string  | The receiver address on the other chain.    |
| amount             | uint256 | The amount of UMEE tokens to be bridged.    |

### decimals

```solidity
function decimals() external view returns (uint8)
```

_Returns the number of decimals used to get its user representation. For example, if `decimals` equals `2`, a balance of `505` tokens should be displayed to a user as `5.05` (`505 / 10 ** 2`). Tokens usually opt for a value of 18, imitating the relationship between Ether and Wei. This is the value {ERC20} uses, unless this function is overridden; NOTE: This information is only used for *display* purposes: it in no way affects any of the arithmetic of the contract, including {IERC20-balanceOf} and {IERC20-transfer}._

#### Returns

| Name | Type  | Description |
| ---- | ----- | ----------- |
| \_0  | uint8 | undefined   |

### decreaseAllowance

```solidity
function decreaseAllowance(address spender, uint256 subtractedValue) external nonpayable returns (bool)
```

_Atomically decreases the allowance granted to `spender` by the caller. This is an alternative to {approve} that can be used as a mitigation for problems described in {IERC20-approve}. Emits an {Approval} event indicating the updated allowance. Requirements: - `spender` cannot be the zero address. - `spender` must have allowance for the caller of at least `subtractedValue`._

#### Parameters

| Name            | Type    | Description |
| --------------- | ------- | ----------- |
| spender         | address | undefined   |
| subtractedValue | uint256 | undefined   |

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

### execute

```solidity
function execute(bytes32 commandId, string sourceChain, string sourceAddress, bytes payload) external nonpayable
```

#### Parameters

| Name          | Type    | Description |
| ------------- | ------- | ----------- |
| commandId     | bytes32 | undefined   |
| sourceChain   | string  | undefined   |
| sourceAddress | string  | undefined   |
| payload       | bytes   | undefined   |

### executeWithToken

```solidity
function executeWithToken(bytes32 commandId, string sourceChain, string sourceAddress, bytes payload, string tokenSymbol, uint256 amount) external nonpayable
```

#### Parameters

| Name          | Type    | Description |
| ------------- | ------- | ----------- |
| commandId     | bytes32 | undefined   |
| sourceChain   | string  | undefined   |
| sourceAddress | string  | undefined   |
| payload       | bytes   | undefined   |
| tokenSymbol   | string  | undefined   |
| amount        | uint256 | undefined   |

### gasReceiver

```solidity
function gasReceiver() external view returns (contract IAxelarGasService)
```

#### Returns

| Name | Type                       | Description |
| ---- | -------------------------- | ----------- |
| \_0  | contract IAxelarGasService | undefined   |

### gateway

```solidity
function gateway() external view returns (contract IAxelarGateway)
```

#### Returns

| Name | Type                    | Description |
| ---- | ----------------------- | ----------- |
| \_0  | contract IAxelarGateway | undefined   |

### gravityBridgeUmee

```solidity
function gravityBridgeUmee() external view returns (address)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | address | undefined   |

### increaseAllowance

```solidity
function increaseAllowance(address spender, uint256 addedValue) external nonpayable returns (bool)
```

_Atomically increases the allowance granted to `spender` by the caller. This is an alternative to {approve} that can be used as a mitigation for problems described in {IERC20-approve}. Emits an {Approval} event indicating the updated allowance. Requirements: - `spender` cannot be the zero address._

#### Parameters

| Name       | Type    | Description |
| ---------- | ------- | ----------- |
| spender    | address | undefined   |
| addedValue | uint256 | undefined   |

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

### name

```solidity
function name() external view returns (string)
```

_Returns the name of the token._

#### Returns

| Name | Type   | Description |
| ---- | ------ | ----------- |
| \_0  | string | undefined   |

### swap

```solidity
function swap(uint256 amount) external nonpayable
```

_Swaps Deprecated Gravity Bridge UMEE for the new, axelar supported UMEE tokens._

#### Parameters

| Name   | Type    | Description                              |
| ------ | ------- | ---------------------------------------- |
| amount | uint256 | The amount of UMEE tokens to be swapped. |

### symbol

```solidity
function symbol() external view returns (string)
```

_Returns the symbol of the token, usually a shorter version of the name._

#### Returns

| Name | Type   | Description |
| ---- | ------ | ----------- |
| \_0  | string | undefined   |

### tokensSwapped

```solidity
function tokensSwapped() external view returns (uint256)
```

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```

_See {IERC20-totalSupply}._

#### Returns

| Name | Type    | Description |
| ---- | ------- | ----------- |
| \_0  | uint256 | undefined   |

### transfer

```solidity
function transfer(address to, uint256 amount) external nonpayable returns (bool)
```

_See {IERC20-transfer}. Requirements: - `to` cannot be the zero address. - the caller must have a balance of at least `amount`._

#### Parameters

| Name   | Type    | Description |
| ------ | ------- | ----------- |
| to     | address | undefined   |
| amount | uint256 | undefined   |

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 amount) external nonpayable returns (bool)
```

_See {IERC20-transferFrom}. Emits an {Approval} event indicating the updated allowance. This is not required by the EIP. See the note at the beginning of {ERC20}. NOTE: Does not update the allowance if the current allowance is the maximum `uint256`. Requirements: - `from` and `to` cannot be the zero address. - `from` must have a balance of at least `amount`. - the caller must have allowance for `from`&#39;s tokens of at least `amount`._

#### Parameters

| Name   | Type    | Description |
| ------ | ------- | ----------- |
| from   | address | undefined   |
| to     | address | undefined   |
| amount | uint256 | undefined   |

#### Returns

| Name | Type | Description |
| ---- | ---- | ----------- |
| \_0  | bool | undefined   |

## Events

### Approval

```solidity
event Approval(address indexed owner, address indexed spender, uint256 value)
```

#### Parameters

| Name              | Type    | Description |
| ----------------- | ------- | ----------- |
| owner `indexed`   | address | undefined   |
| spender `indexed` | address | undefined   |
| value             | uint256 | undefined   |

### Swap

```solidity
event Swap(address indexed user, uint256 amount)
```

_Emitted when a token swap occurs._

#### Parameters

| Name           | Type    | Description                                     |
| -------------- | ------- | ----------------------------------------------- |
| user `indexed` | address | The address of the user who initiated the swap. |
| amount         | uint256 | The amount of tokens swapped.                   |

### Transfer

```solidity
event Transfer(address indexed from, address indexed to, uint256 value)
```

#### Parameters

| Name           | Type    | Description |
| -------------- | ------- | ----------- |
| from `indexed` | address | undefined   |
| to `indexed`   | address | undefined   |
| value          | uint256 | undefined   |

## Errors

### InvalidAddress

```solidity
error InvalidAddress()
```

### InvalidAmount

```solidity
error InvalidAmount()
```

_Custom error thrown when the provided amount is less then zero._

### NotApprovedByGateway

```solidity
error NotApprovedByGateway()
```
