require("solidity-coverage");
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("hardhat-contract-sizer");
require("@primitivefi/hardhat-dodoc");

module.exports = {
  defaultNetwork: "hardhat",

  solidity: {
    compilers: [
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 999999,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.ETHEREUM_RPC || "",
        blockNumber: 16828207, // block pinning gives x20 perfromance due to caching as stated on hardhat docs
        enabled: true,
      },
    },
    mainnet: {
      url: process.env.ETHEREUM_RPC || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    goerli: {
      url: process.env.GOERLI_RPC || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  dodoc: {
    runOnCompile: false,
    debugMode: true,
    include: ["contracts/UmeeToken.sol"],
    // More options...
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
  },

  etherscan: {
    apiKey: {
      1: process.env.ETHERSCAN_API_KEY || "",
      goerli: process.env.ETHERSCAN_API_KEY || "",
    },
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  },
};
