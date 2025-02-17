const hre = require("hardhat");

async function main() {
  // Ethereum Lock Contract
  const EthLockContract = await hre.ethers.getContractFactory("LockContract");
  const ethLockContract = await EthLockContract.deploy();

  await ethLockContract.deployed();

  console.log("Ethereum LockContract deployed to:", ethLockContract.address);

  // Binance Smart Chain Lock Contract
  const BscLockContract = await hre.ethers.getContractFactory("BinanceLockContract");
  const bscLockContract = await BscLockContract.deploy();

  await bscLockContract.deployed();

  console.log("Binance Smart Chain LockContract deployed to:", bscLockContract.address);
  const MintContract = await hre.ethers.getContractFactory("MintContract");
  const mintContract = await MintContract.deploy();

  await mintContract.deployed();

  console.log("MintContract deployed to:", mintContract.address);

  const PoolContract = await hre.ethers.getContractFactory("PoolContract");
  const poolContract = await PoolContract.deploy();

  await poolContract.deployed();

  console.log("PoolContract deployed to:", poolContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

