const hre = require("hardhat");

async function main() {
  const MaskBTC = await hre.ethers.getContractFactory("MaskBTC");
  const maskBTC = await MaskBTC.deploy();

  await maskBTC.deployed();

  console.log(`MaskBTC deployed to ${maskBTC.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

