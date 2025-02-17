const hre = require("hardhat");

async function main() {
  // Ethereum Contract Verification
  let ethContractAddress = process.env.ETH_QUA_ADDRESS;
  if (!ethContractAddress) {
    throw new Error("Missing ETH_QUA_ADDRESS environment variable");
  }

  console.log("Verifying Ethereum QUA contract...");
  
// Ethereum Contract Verification
  try {
    await verifyContract(ethContractAddress, "Ethereum");
  } catch (ethError) {
    console.warn("Ethereum verification failed:", ethError.message);
  }

  // Binance Smart Chain Contract Verification
  let bscContractAddress = process.env.BSC_QUA_ADDRESS;
  if (bscContractAddress && (hre.network.name === "bsc" || hre.network.name === "bsc-testnet")) {
    console.log("Verifying Binance Smart Chain QUA contract...");
    try {
      await verifyContract(bscContractAddress, "Binance Smart Chain");
    } catch (bscError) {
      console.warn("BSC verification failed:", bscError.message);
    }
  }
}

async function verifyContract(address, chainName) {
  console.log(`Verifying ${chainName} QUA contract...`);
  await hre.run("verify:verify", {
    address: address,
    constructorArguments: [],
  });
  console.log(`${chainName} QUA verification complete`);
}
  
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

