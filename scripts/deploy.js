import { ethers } from "hardhat";
const hre = require("hardhat");
import { parseUnits } from "@ethersproject/units";

async function main() {
  const Token = await ethers.getContractFactory("GravityBridgeUmee");
  const gravityBridgeUmee = await Token.deploy();

  const UmeeToken = await ethers.getContractFactory("Umee");
  const umeeToken = await UmeeToken.deploy(
    gravityBridgeUmee.address,
    parseUnits("500_000_000_000", "6")
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
      contract: "contracts/UmeeToken.sol:Umee",
      address: umeeToken.address,
      constructorArguments: [gravityBridgeUmee.address],
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
