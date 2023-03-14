import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
const { formatUnits, parseUnits } = require("@ethersproject/units");
describe("Test Burn", function () {
  async function deployTestFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("TestUmee");
    const oldUmee = await Token.deploy();
    //old umee mainnet: 0xc0a4df35568f116c370e6a6a6022ceb908eeddac
    const axelarGateWay = "0x4F4495243837681061C4743b74B3eEdf548D56A5"; // mainnet
    const axelarGasReciever = "0x2d5d7d31F671F86C782533cc367F14109a082712"; // mainnet
    const UmeeToken = await ethers.getContractFactory("UmeeAxelarToken");
    const umeeToken = await UmeeToken.deploy(
      oldUmee.address,
      axelarGateWay,
      axelarGasReciever
    );

    const decimal = 6;
    const deadAddress = await umeeToken.deadAddress();

    return { umeeToken, oldUmee, owner, otherAccount, decimal, deadAddress };
  }

  describe("Test OldUmee Swap and Burn", function () {
    it("Should check that test gravity bridge umee was deployed correctly", async function () {
      const { umeeToken, oldUmee, owner, decimal } = await loadFixture(
        deployTestFixture
      );

      expect(await oldUmee.totalSupply()).to.equal(
        parseUnits("1000000", decimal)
      );
      expect(await oldUmee.balanceOf(owner.address)).to.equal(
        await oldUmee.totalSupply()
      );
      expect(await umeeToken.balanceOf(owner.address)).to.equal(0);
      expect(await umeeToken.totalSupply()).to.equal(0);
    });

    it("Should swap correctly ", async function () {
      const { umeeToken, oldUmee, owner, decimal, deadAddress } =
        await loadFixture(deployTestFixture);

      const approve = await oldUmee.approve(
        umeeToken.address,
        parseUnits("100", decimal)
      );
      await approve.wait();

      const swap = await umeeToken.swapGB(parseUnits("100", decimal));
      await swap.wait();

      expect(await oldUmee.balanceOf(owner.address)).to.equal(
        parseUnits("999900", decimal)
      );
      expect(await umeeToken.balanceOf(owner.address)).to.equal(
        parseUnits("100", decimal)
      );
      expect(await oldUmee.balanceOf(deadAddress)).to.equal(
        parseUnits("100", decimal)
      );

      describe("Events", function () {
        it("Should emit an event on swap", async function () {
          const { umeeToken, oldUmee, owner, decimal } = await loadFixture(
            deployTestFixture
          );

          const approve = await oldUmee.approve(
            umeeToken.address,
            parseUnits("50", decimal)
          );
          await approve.wait();

          await expect(umeeToken.swapGB("50"))
            .to.emit(umeeToken, "SwapGB")
            .withArgs(owner.address, "50"); // We accept any value as `when` arg
        });
      });
    });

    // it("Should receive and store the funds to lock", async function () {
    //   const { lock, lockedAmount } = await loadFixture(
    //     deployOneYearLockFixture
    //   );

    //   expect(await ethers.provider.getBalance(lock.address)).to.equal(
    //     lockedAmount
    //   );
    // });

    // it("Should fail if the unlockTime is not in the future", async function () {
    //   // We don't use the fixture here because we want a different deployment
    //   const latestTime = await time.latest();
    //   const Lock = await ethers.getContractFactory("Lock");
    //   await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
    //     "Unlock time should be in the future"
    //   );
    // });
  });

  describe("Withdrawals", function () {
    // describe("Validations", function () {
    //   it("Should revert with the right error if called too soon", async function () {
    //     const { lock } = await loadFixture(deployOneYearLockFixture);
    //     await expect(lock.withdraw()).to.be.revertedWith(
    //       "You can't withdraw yet"
    //     );
    //   });
    //   it("Should revert with the right error if called from another account", async function () {
    //     const { lock, unlockTime, otherAccount } = await loadFixture(
    //       deployOneYearLockFixture
    //     );
    //     // We can increase the time in Hardhat Network
    //     await time.increaseTo(unlockTime);
    //     // We use lock.connect() to send a transaction from another account
    //     await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
    //       "You aren't the owner"
    //     );
    //   });
    //   it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
    //     const { lock, unlockTime } = await loadFixture(
    //       deployOneYearLockFixture
    //     );
    //     // Transactions are sent using the first signer by default
    //     await time.increaseTo(unlockTime);
    //     await expect(lock.withdraw()).not.to.be.reverted;
    //   });
    // });
    // describe("Transfers", function () {
    //   it("Should transfer the funds to the owner", async function () {
    //     const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
    //       deployOneYearLockFixture
    //     );
    //     await time.increaseTo(unlockTime);
    //     await expect(lock.withdraw()).to.changeEtherBalances(
    //       [owner, lock],
    //       [lockedAmount, -lockedAmount]
    //     );
    //   });
    // });
  });
});
