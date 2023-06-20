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
      deadAddress;

    before(async function () {
      // load the fixture only once
      ({
        umeeMigrator,
        umeeAxlarToken,
        gravityBridgeUmee,
        owner,
        decimal,
        deadAddress,
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
      expect(await umeeAxlarToken.balanceOf(owner.address)).to.equal(
        await umeeAxlarToken.totalSupply()
      );
    });
    it("Should Load up smart Contract with Axelar Umee", async function () {
      await umeeAxlarToken.transfer(
        umeeMigrator.address,
        parseUnits("1000000", decimal)
      );

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
        .approve(umeeToken.address, parseUnits("100", decimal));
      await approve.wait();

      const swap = await umeeToken
        .connect(otherAccount)
        .swapGB(parseUnits("100", decimal));
      await swap.wait();

      expect(await gravityBridgeUmee.balanceOf(otherAccount.address)).to.equal(
        parseUnits("0", decimal)
      );
      expect(await umeeToken.balanceOf(otherAccount.address)).to.equal(
        parseUnits("100", decimal)
      );
      expect(await gravityBridgeUmee.balanceOf(deadAddress)).to.equal(
        parseUnits("100", decimal)
      );
      expect(await umeeToken.totalSupply()).to.equal(
        await umeeToken.balanceOf(otherAccount.address)
      );
    });
    it("Should burn old Umee", async function () {
      const approve = await gravityBridgeUmee.approve(
        umeeToken.address,
        parseUnits("100", decimal)
      );
      await approve.wait();

      const swap = await umeeToken.swapGB(parseUnits("100", decimal));
      await swap.wait();

      expect(await gravityBridgeUmee.balanceOf(deadAddress)).to.equal(
        parseUnits("100", decimal)
      );
    });

    it("Should mint new Umee", async function () {
      const approve = await gravityBridgeUmee.approve(
        umeeToken.address,
        parseUnits("100", decimal)
      );
      await approve.wait();

      const swap = await umeeToken.swapGB(parseUnits("100", decimal));
      await swap.wait();

      expect(await umeeToken.balanceOf(owner.address)).to.equal(
        parseUnits("100", decimal)
      );

      expect(await umeeToken.totalSupply()).to.equal(
        await umeeToken.balanceOf(owner.address)
      );
    });
  });

  describe("Events", function () {
    it("Should emit an event on swap", async function () {
      const { umeeToken, gravityBridgeUmee, owner, decimal } =
        await loadFixture(deployTestFixture);

      const approve = await gravityBridgeUmee.approve(
        umeeToken.address,
        parseUnits("50", decimal)
      );
      await approve.wait();

      await expect(umeeToken.swapGB(parseUnits("50", decimal)))
        .to.emit(umeeToken, "SwapGB")
        .withArgs(owner.address, parseUnits("50", decimal)); // We accept any value as `when` arg
    });
  });

  describe("Custom Errors", function () {
    it("should revert if amount is zero", async function () {
      await expect(umeeToken.swapGB(0)).to.be.revertedWithCustomError(
        umeeToken,
        `InvalidAmount`
      );
    });

    it("Should revert if over the max total supply", async function () {
      const approve = await gravityBridgeUmee.approve(
        umeeToken.address,
        parseUnits("5000", decimal)
      );
      await approve.wait();

      await expect(
        umeeToken.swapGB(parseUnits("5000", decimal))
      ).to.be.revertedWithCustomError(umeeToken, `MaxSupplyReached`); // We accept any value as `when` arg
    });

    it("should revert if sender has insufficient balance", async function () {
      const approve = await gravityBridgeUmee
        .connect(otherAccount)
        .approve(umeeToken.address, parseUnits("500", decimal));
      await approve.wait();

      await expect(
        umeeToken.connect(otherAccount).swapGB(parseUnits("100", decimal))
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("should revert if sender has insufficient allowance", async function () {
      await expect(
        umeeToken.swapGB(parseUnits("100", decimal))
      ).to.be.revertedWith("ERC20: insufficient allowance");
    });
  });
});
