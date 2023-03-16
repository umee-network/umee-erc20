import { ethers } from "hardhat";
const hre = require("hardhat");

async function main() {
  // const axelarGateWay = "0x4F4495243837681061C4743b74B3eEdf548D56A5"; // mainnet
  // const axelarGasReciever = "0x2d5d7d31F671F86C782533cc367F14109a082712"; // mainnet

  // chain-name: ethereum-2
  const axelarGateWay = "0xe432150cce91c13a887f7D836923d5597adD8E31"; // goerli
  const axelarGasReciever = "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6"; // goerli

  const Token = await ethers.getContractFactory("GravityBridgeUmee");
  const gravityBridgeUmee = await Token.deploy();

  const UmeeToken = await ethers.getContractFactory("UmeeAxelarToken");
  const umeeToken = await UmeeToken.deploy(
    gravityBridgeUmee.address,
    axelarGateWay,
    axelarGasReciever
  );

  console.log(
    `New Umee Token deployed at ${umeeToken.address} with old umee at ${gravityBridgeUmee.address}`
  );

  //wait 15 seconds before verifying
  console.log("Waiting 15 seconds before verifying...");
  await new Promise((r) => setTimeout(r, 15000));

  try {
    await hre.run("verify:verify", {
      contract: "contracts/test/testUmee.sol:GravityBridgeUmee",
      address: gravityBridgeUmee.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.log("Old Umee Failed to verify::", error);
  }
  try {
    await hre.run("verify:verify", {
      contract: "contracts/UmeeAxelarToken.sol:UmeeAxelarToken",
      address: umeeToken.address,
      constructorArguments: [
        gravityBridgeUmee.address,
        axelarGateWay,
        axelarGasReciever,
      ],
    });
  } catch (error) {
    console.log("New Umee Failed to verify::", error);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
