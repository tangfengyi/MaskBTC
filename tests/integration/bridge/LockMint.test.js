const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lock-Mint Bridge Integration", function () {
  let LockContract;
  let lockContract;
  let MintContract;
  let mintContract;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    // Deploy LockContract on Ethereum
    LockContract = await ethers.getContractFactory("LockContract");
    lockContract = await LockContract.deploy();
    await lockContract.deployed();

    // Deploy MintContract on Solana (mock)
    MintContract = await ethers.getContractFactory("MintContract");
    mintContract = await MintContract.deploy();
    await mintContract.deployed();
  });

  describe("Lock and Mint Process", function () {
    it("Should lock tokens on Ethereum and mint on Solana", async function () {
      // Lock tokens on Ethereum
      const lockAmount = ethers.utils.parseEther("1.0");
      await lockContract.connect(addr1).lock(lockAmount);

      // Verify locked balance
      const lockedBalance = await lockContract.lockedBalances(addr1.address);
      expect(lockedBalance).to.equal(lockAmount);

      // Mint tokens on Solana
      await mintContract.connect(addr1).mint(lockAmount);

      // Verify minted balance
      const mintedBalance = await mintContract.balanceOf(addr1.address);
      expect(mintedBalance).to.equal(lockAmount);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero value lock operations", async function () {
      const initialBalance = await sourceToken.balanceOf(owner.address);
      
      await expect(
        bridge.lockTokens(0)
      ).to.be.revertedWith("Amount must be greater than zero");
      
      expect(await sourceToken.balanceOf(owner.address)).to.equal(initialBalance);
    });

    it("Should prevent locking to invalid target chains", async function () {
      await expect(
        bridge.lockTokens(100, { targetChain: 9999 })
      ).to.be.revertedWith("Invalid target chain");
    });
    
    it("Should handle maximum token limits during lock", async function () {
      const maxSupply = ethers.BigNumber.from("100000000000000000000000000");
      
      await expect(
        bridge.lockTokens(maxSupply.add(1))
      ).to.be.revertedWith("Exceeds available balance or limit");
    });
  });

});

