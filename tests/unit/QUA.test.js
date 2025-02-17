const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("QUA Token", function () {
  let QUA, ReferralRewards;
  let qua, referral;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy QUA token
    QUA = await ethers.getContractFactory("QUA");
    qua = await QUA.deploy();
    await qua.deployed();

    // Deploy ReferralRewards contract
    ReferralRewards = await ethers.getContractFactory("ReferralRewards");
    referral = await ReferralRewards.deploy(qua.address, owner.address);
    await referral.deployed();

    // Set referral contract in QUA
    await qua.setReferralRewardsContract(referral.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await qua.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply to the owner", async function () {
      expect(await qua.balanceOf(owner.address)).to.equal(await qua.totalSupply());
    });

    it("Should set referral rewards contract", async function () {
      expect(await qua.referralRewardsContract()).to.equal(referral.address);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      await qua.transfer(addr1.address, 50);
      expect(await qua.balanceOf(addr1.address)).to.equal(50);

      await qua.connect(addr1).transfer(addr2.address, 50);
      expect(await qua.balanceOf(addr2.address)).to.equal(50);
    });

    it("Should fail if sender has insufficient balance", async function () {
      const initialBalance = await qua.balanceOf(owner.address);
      
      await expect(
        qua.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      expect(await qua.balanceOf(owner.address)).to.equal(initialBalance);
    });
  });

  describe("Referral Rewards", function () {
    const mintAmount = ethers.utils.parseEther("1000");

    it("Should distribute referral rewards on mint", async function () {
      await expect(qua.mint(addr1.address, mintAmount))
        .to.emit(referral, "RewardDistributed")
        .withArgs(addr1.address, mintAmount);
    });

    it("Should emit event on failed reward distribution", async function () {
      // Set invalid referral contract
      await qua.setReferralRewardsContract(addr2.address);
      
      await expect(qua.mint(addr1.address, mintAmount))
        .to.emit(qua, "RewardDistributionFailed")
        .withArgs(addr1.address, mintAmount);
    });

    it("Should handle rewards when referral contract not set", async function () {
      await qua.setReferralRewardsContract(ethers.constants.AddressZero);
      
      await expect(qua.mint(addr1.address, mintAmount))
        .not.to.emit(referral, "RewardDistributed");
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero value transfers", async function () {
      await qua.transfer(addr1.address, 0);
      expect(await qua.balanceOf(addr1.address)).to.equal(0);
    });

    it("Should prevent transfers to zero address", async function () {
      await expect(
        qua.transfer(ethers.constants.AddressZero, 100)
      ).to.be.revertedWith("ERC20: transfer to the zero address");
    });

    it("Should enforce max supply limit", async function () {
      const maxSupply = await qua.MAX_SUPPLY();
      await expect(
        qua.mint(owner.address, maxSupply.add(1))
      ).to.be.revertedWith("Exceeds max supply");
    });
  });
});
