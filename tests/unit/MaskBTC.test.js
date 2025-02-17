const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MaskBTC Contract", () => {
  let MaskBTC;
  let maskBTC;
  let owner, minter, oracle, user;

  before(async () => {
    [owner, minter, oracle, user] = await ethers.getSigners();
    MaskBTC = await ethers.getContractFactory("MaskBTC");
    maskBTC = await MaskBTC.deploy();
    await maskBTC.deployed();

    // 设置角色
    await maskBTC.grantRole(await maskBTC.MINTER_ROLE(), minter.address);
    await maskBTC.grantRole(await maskBTC.ORACLE_ROLE(), oracle.address);
  });

  it("应正确初始化代币参数", async () => {
    expect(await maskBTC.name()).to.equal("MaskBTC");
    expect(await maskBTC.symbol()).to.equal("MBTC");
    expect(await maskBTC.TOTAL_SUPPLY()).to.equal(ethers.utils.parseUnits("480000000", 18));
    expect(await maskBTC.GENESIS_SUPPLY()).to.equal(ethers.utils.parseUnits("9600000", 18));
  });

  it("应允许管理员更新释放参数", async () => {
    await expect(
      maskBTC.connect(user).updateReleaseParams(500000, 2)
    ).to.be.revertedWith("AccessControl");

    await maskBTC.updateReleaseParams(500000, 2);
    expect(await maskBTC.monthlyRelease()).to.equal(500000);
    expect(await maskBTC.currentReleasePhase()).to.equal(2);
  });

  it("应正确执行每月释�?, async () => {
    await expect(
      maskBTC.connect(user).executeMonthlyRelease()
    ).to.be.revertedWith("AccessControl");

    const initialBalance = await maskBTC.balanceOf(owner.address);
    await maskBTC.connect(minter).executeMonthlyRelease();
    const newBalance = await maskBTC.balanceOf(owner.address);

    expect(newBalance.sub(initialBalance)).to.equal(
      ethers.utils.parseUnits("1000000", 18)
    );
  });

  it("应正确处理QUA兑换", async () => {
    // 设置QUA总量
    await maskBTC.connect(oracle).setCurrentQUATotal(1000000);
    
    // 执行释放
    await maskBTC.connect(minter).executeMonthlyRelease();
    
    // 用户兑换
    const initialBalance = await maskBTC.balanceOf(user.address);
    await maskBTC.connect(user).convertQUA(500000);
    const newBalance = await maskBTC.balanceOf(user.address);
    
    const expectedAmount = (500000 * 1000000 * 1e18) / 1000000;
    expect(newBalance.sub(initialBalance)).to.equal(expectedAmount);
  });

  it("应记录兑换历�?, async () => {
    await maskBTC.connect(oracle).setCurrentQUATotal(2000000);
    await maskBTC.connect(minter).executeMonthlyRelease();
    await maskBTC.connect(user).convertQUA(1000000);

    const history = await maskBTC.conversionHistory(0);
    expect(history.month).to.equal(1);
    expect(history.releaseAmount).to.equal(ethers.utils.parseUnits("1000000", 18));
    expect(history.quaTotal).to.equal(1000000);
  });
});

