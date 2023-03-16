import { ethers } from "hardhat";
const hre = require("hardhat");

async function main() {
  const axelarGateWay = "0x4F4495243837681061C4743b74B3eEdf548D56A5"; // mainnet
  const axelarGasReciever = "0x2d5d7d31F671F86C782533cc367F14109a082712"; // mainnet

  const Token = await ethers.getContractFactory("TestUmee");
  const oldUmee = await Token.deploy();

  const UmeeToken = await ethers.getContractFactory("UmeeAxelarToken");
  const umeeToken = await UmeeToken.deploy(
    oldUmee.address,
    axelarGateWay,
    axelarGasReciever
  );

  console.log(
    `New Umee Token deployed at ${umeeToken.address} with old umee at ${oldUmee.address}`
  );

  try {
    await hre.run("verify:verify", {
      contract: "contracts/test/TestUmee.sol:TestUmee",
      address: oldUmee.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.log("Old Umee Failed to verify::", error);
  }
  try {
    await hre.run("verify:verify", {
      contract: "contracts/UmeeAxelarToken.sol:UmeeAxelarToken",
      address: umeeToken.address,
      constructorArguments: [oldUmee.address, axelarGateWay, axelarGasReciever],
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
