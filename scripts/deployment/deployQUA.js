const hre = require("hardhat");

async function main() {
  // Deploy QUA token
  const initialSupply = ethers.utils.parseEther("10000000");
  const QUA = await hre.ethers.getContractFactory("QUA");
  const qua = await QUA.deploy(initialSupply);
  await qua.deployed();
  console.log("QUA deployed to:", qua.address);

  // Deploy ReferralRewards contract
  const foundationAddress = process.env.FOUNDATION_ADDRESS;
  if (!foundationAddress) {
    throw new Error("FOUNDATION_ADDRESS environment variable required");
  }
  
  const ReferralRewards = await hre.ethers.getContractFactory("ReferralRewards");
  const referral = await ReferralRewards.deploy(qua.address, foundationAddress);
  await referral.deployed();
  console.log("ReferralRewards deployed to:", referral.address);

  // Set referral contract address in QUA
  await qua.setReferralRewardsContract(referral.address);
  console.log("Referral contract set in QUA");

  // Verification with chunked processing
  if (hre.network.name === "mainnet" || hre.network.name === "rinkeby") {
    console.log("Starting contract verification...");
    
    // Verify QUA contract first
    await verifyWithRetry(qua.address, [initialSupply]);
    
    // Add delay between verifications
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Verify ReferralRewards contract
    await verifyWithRetry(referral.address, [qua.address, foundationAddress]);
  }

  async function verifyWithRetry(address, args) {
    try {
      console.log(`Verifying contract at ${address}...`);
      await hre.run("verify:verify", { address, constructorArguments: args });
    } catch (error) {
      if (error.message.includes("Already Verified")) {
        console.log(`Contract ${address} already verified`);
      } else {
        console.error(`Verification failed for ${address}:`, error.message);
      }
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
