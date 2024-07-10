# ADAMANTIUM BEP-20 Token Smart Contract

This contract implements the ADAMANTIUM BEP-20 token with standard BEP-20 functions, transaction fees, maximum transaction limits, fee exclusions, and Dex integration for liquidity pairs. It includes ownership management and uses the SafeMath library for safe arithmetic operations.

## Features

- Standard BEP-20 functions: `transfer`, `approve`, `transferFrom`, `allowance`, `balanceOf`, and `totalSupply`.
- Ownership management: Transfer and renounce ownership.
- Transaction fees and max transaction limits with exclusions.
- Dex integration for creating liquidity pairs.

## Installation

```shell
npx hardhat compile
npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```
