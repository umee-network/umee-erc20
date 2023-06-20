const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { formatUnits, parseUnits } = require("@ethersproject/units");

describe("Test Burn", function () {
  async function deployTestFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("GravityBridgeUmee");
    const gravityBridgeUmee = await Token.deploy();
    const UmeeAxlarToken = await ethers.getContractFactory("GravityBridgeUmee");
    const umeeAxlarToken = await UmeeAxlarToken.deploy();
    //old umee mainnet: 0xc0a4df35568f116c370e6a6a6022ceb908eeddac

    const UmeeToken = await ethers.getContractFactory("UmeeTokenMigrator");
    const umeeMigrator = await UmeeToken.deploy(
      gravityBridgeUmee.address,
      umeeAxlarToken.address
    );

    const decimal = 6;
    const deadAddress = await umeeMigrator.deadAddress();

    await umeeAxlarToken.transfer(
      umeeMigrator.address,
      parseUnits("1000000", decimal)
    );

    return {
      umeeMigrator,
      gravityBridgeUmee,
      owner,
      otherAccount,
      decimal,
      deadAddress,
      umeeAxlarToken,
    };
  }

  describe("Test Gravity Bridge Swap and Burn", function () {
    let umeeMigrator,
      umeeAxlarToken,
      gravityBridgeUmee,
      owner,
      decimal,
      deadAddress,
      otherAccount;

    before(async function () {
      // load the fixture only once
      ({
        umeeMigrator,
        umeeAxlarToken,
        gravityBridgeUmee,
        owner,
        decimal,
        deadAddress,
        otherAccount,
      } = await loadFixture(deployTestFixture));
    });

    it("Should check that test gravity bridge umee was deployed correctly", async function () {
      expect(await gravityBridgeUmee.totalSupply()).to.equal(
        parseUnits("1000000", decimal)
      );
      expect(await gravityBridgeUmee.balanceOf(owner.address)).to.equal(
        await gravityBridgeUmee.totalSupply()
      );

      expect(await umeeAxlarToken.totalSupply()).to.equal(
        parseUnits("1000000", decimal)
      );
      expect(await umeeAxlarToken.balanceOf(umeeMigrator.address)).to.equal(
        await umeeAxlarToken.totalSupply()
      );
    });
    it("Should Load up smart Contract with Axelar Umee", async function () {
      expect(await umeeAxlarToken.balanceOf(umeeMigrator.address)).to.equal(
        parseUnits("1000000", decimal)
      );
      expect(await umeeAxlarToken.balanceOf(owner.address)).to.equal(
        parseUnits("0", decimal)
      );
    });

    it("Should swap Gravity Bridge Umee with Axelar Umee ", async function () {
      const approve = await gravityBridgeUmee.approve(
        umeeMigrator.address,
        parseUnits("100", decimal)
      );

      await approve.wait();

      const swap = await umeeMigrator.swapGB(parseUnits("100", decimal));
      await swap.wait();

      expect(await gravityBridgeUmee.balanceOf(owner.address)).to.equal(
        parseUnits("999900", decimal)
      );
      expect(await umeeAxlarToken.balanceOf(owner.address)).to.equal(
        parseUnits("100", decimal)
      );
      expect(await gravityBridgeUmee.balanceOf(deadAddress)).to.equal(
        parseUnits("100", decimal)
      );
      expect(await umeeAxlarToken.balanceOf(owner.address)).to.equal(
        parseUnits("100", decimal)
      );
    });

    it("should allow others to swap old gravity bridge umee for new umee", async function () {
      const sendToAccount = await gravityBridgeUmee.transfer(
        otherAccount.address,
        parseUnits("100", decimal)
      );

      await sendToAccount.wait();

      const approve = await gravityBridgeUmee
        .connect(otherAccount)
        .approve(umeeMigrator.address, parseUnits("100", decimal));
      await approve.wait();

      const swap = await umeeMigrator
        .connect(otherAccount)
        .swapGB(parseUnits("100", decimal));
      await swap.wait();

      expect(await gravityBridgeUmee.balanceOf(otherAccount.address)).to.equal(
        parseUnits("0", decimal)
      );
      expect(await umeeAxlarToken.balanceOf(otherAccount.address)).to.equal(
        parseUnits("100", decimal)
      );
      expect(await gravityBridgeUmee.balanceOf(deadAddress)).to.equal(
        parseUnits("200", decimal)
      );
      expect(await umeeAxlarToken.balanceOf(otherAccount.address)).to.equal(
        parseUnits("100", decimal)
      );
    });

    it("Should burn old Umee", async function () {
      expect(await gravityBridgeUmee.balanceOf(deadAddress)).to.equal(
        parseUnits("200", decimal)
      );
    });

    it("Should emit an event on swap", async function () {
      const approve = await gravityBridgeUmee.approve(
        umeeMigrator.address,
        parseUnits("50", decimal)
      );
      await approve.wait();

      await expect(umeeMigrator.swapGB(parseUnits("50", decimal)))
        .to.emit(umeeMigrator, "SwapGB")
        .withArgs(owner.address, parseUnits("50", decimal)); // We accept any value as `when` arg
    });

    it("should revert if amount is zero", async function () {
      await expect(umeeMigrator.swapGB(0)).to.be.revertedWithCustomError(
        umeeMigrator,
        `InvalidAmount`
      );
    });

    it("should allow owner to emergency withdraw", async function () {
      const withdraw = await umeeMigrator.emergencyWithdraw();
      await withdraw.wait();

      expect(await umeeAxlarToken.balanceOf(owner.address)).to.equal(
        parseUnits("999900", decimal)
      );
      expect(await umeeAxlarToken.balanceOf(umeeMigrator.address)).to.equal(
        parseUnits("0", decimal)
      );
    });
  });
});
