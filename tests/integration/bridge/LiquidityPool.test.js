const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Liquidity Pool Bridge Integration", function () {
  let PoolContract;
  let poolContract;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy PoolContract
    PoolContract = await ethers.getContractFactory("PoolContract");
    poolContract = await PoolContract.deploy();
    await poolContract.deployed();
  });

  describe("Add and Remove Liquidity", function () {
    it("Should allow adding and removing liquidity", async function () {
      const tokenAmount = ethers.utils.parseEther("100.0");
      const ethAmount = ethers.utils.parseEther("1.0");

      // Add liquidity
      await poolContract.connect(addr1).addLiquidity(tokenAmount, { value: ethAmount });
      
      // Check balances
      const tokenBalance = await poolContract.getTokenBalance();
      const ethBalance = await poolContract.getEthBalance();
      expect(tokenBalance).to.equal(tokenAmount);
      expect(ethBalance).to.equal(ethAmount);

      // Remove liquidity
      await poolContract.connect(addr1).removeLiquidity(ethAmount.div(2));

      // Check updated balances
      const newTokenBalance = await poolContract.getTokenBalance();
      const newEthBalance = await poolContract.getEthBalance();
      expect(newTokenBalance).to.be.lt(tokenAmount);
      expect(newEthBalance).to.be.lt(ethAmount);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero liquidity addition", async function () {
      const initialBalance = await token.balanceOf(owner.address);
      
      await expect(
        pool.addLiquidity(0)
      ).to.be.revertedWith("Amount must be greater than zero");
      
      expect(await token.balanceOf(owner.address)).to.equal(initialBalance);
    });

    it("Should prevent adding more liquidity than balance", async function () {
      const userBalance = await token.balanceOf(owner.address);
      
      await expect(
        pool.addLiquidity(userBalance.add(1))
      ).to.be.revertedWith("Insufficient balance");
    });
    
    it("Should handle price impact calculations correctly", async function () {
      const largeAmount = ethers.utils.parseEther("1000000");
      
      // Check price impact warning threshold
      await expect(
        pool.swap(largeAmount)
      ).to.emit(pool, "PriceImpactWarning");
    });
  });

});

