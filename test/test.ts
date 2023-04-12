import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { formatUnits, parseUnits } from "@ethersproject/units";

describe("Test Burn", function () {
  async function deployTestFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("GravityBridgeUmee");
    const gravityBridgeUmee = await Token.deploy();
    //old umee mainnet: 0xc0a4df35568f116c370e6a6a6022ceb908eeddac

    const UmeeToken = await ethers.getContractFactory("Umee");
    const umeeToken = await UmeeToken.deploy(gravityBridgeUmee.address);

    const decimal = 6;
    const deadAddress = await umeeToken.deadAddress();

    return {
      umeeToken,
      gravityBridgeUmee,
      owner,
      otherAccount,
      decimal,
      deadAddress,
    };
  }

  describe("Test Gravity Bridge Swap and Burn", function () {
    it("Should check that test gravity bridge umee was deployed correctly", async function () {
      const { umeeToken, gravityBridgeUmee, owner, decimal } =
        await loadFixture(deployTestFixture);

      expect(await gravityBridgeUmee.totalSupply()).to.equal(
        parseUnits("1000000", decimal)
      );
      expect(await gravityBridgeUmee.balanceOf(owner.address)).to.equal(
        await gravityBridgeUmee.totalSupply()
      );
      expect(await umeeToken.balanceOf(owner.address)).to.equal(0);
      expect(await umeeToken.totalSupply()).to.equal(0);
    });

    it("Should swap Gravity Bridge Umee with New Umee ", async function () {
      const { umeeToken, gravityBridgeUmee, owner, decimal, deadAddress } =
        await loadFixture(deployTestFixture);

      const approve = await gravityBridgeUmee.approve(
        umeeToken.address,
        parseUnits("100", decimal)
      );
      await approve.wait();

      const swap = await umeeToken.swapGB(parseUnits("100", decimal));
      await swap.wait();

      expect(await gravityBridgeUmee.balanceOf(owner.address)).to.equal(
        parseUnits("999900", decimal)
      );
      expect(await umeeToken.balanceOf(owner.address)).to.equal(
        parseUnits("100", decimal)
      );
      expect(await gravityBridgeUmee.balanceOf(deadAddress)).to.equal(
        parseUnits("100", decimal)
      );
      expect(await umeeToken.totalSupply()).to.equal(
        await umeeToken.balanceOf(owner.address)
      );
    });

    it("should allow others to swap old gravity bridge umee for new umee", async function () {
      const {
        umeeToken,
        gravityBridgeUmee,
        owner,
        decimal,
        deadAddress,
        otherAccount,
      } = await loadFixture(deployTestFixture);

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
      const { umeeToken, gravityBridgeUmee, decimal, deadAddress } =
        await loadFixture(deployTestFixture);

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
      const { umeeToken, gravityBridgeUmee, owner, decimal } =
        await loadFixture(deployTestFixture);

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

      await expect(umeeToken.swapGB("50"))
        .to.emit(umeeToken, "SwapGB")
        .withArgs(owner.address, "50"); // We accept any value as `when` arg
    });
  });

  describe("Custom Errors", function () {
    it("should revert if amount is zero", async function () {
      const { umeeToken } = await loadFixture(deployTestFixture);

      await expect(umeeToken.swapGB(0)).to.be.revertedWithCustomError(
        umeeToken,
        `InvalidAmount`
      );
    });

    it("should revert if sender has insufficient balance", async function () {
      const { umeeToken, gravityBridgeUmee, decimal, otherAccount } =
        await loadFixture(deployTestFixture);

      const approve = await gravityBridgeUmee
        .connect(otherAccount)
        .approve(umeeToken.address, parseUnits("500", decimal));
      await approve.wait();

      await expect(
        umeeToken.connect(otherAccount).swapGB(parseUnits("100", decimal))
      ).to.be.revertedWithCustomError(umeeToken, `InsufficientBalance`);
    });

    it("should revert if sender has insufficient allowance", async function () {
      const { umeeToken, decimal } = await loadFixture(deployTestFixture);

      await expect(
        umeeToken.swapGB(parseUnits("100", decimal))
      ).to.be.revertedWithCustomError(umeeToken, `InsufficientAllowance`);
    });
  });
});
