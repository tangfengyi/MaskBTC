const hre = require("hardhat");

async function main() {
  const QuantumResistantSignature = await hre.ethers.getContractFactory("QuantumResistantSignature");
  const contract = await QuantumResistantSignature.deploy();
  
  await contract.deployed();
  console.log("QuantumResistantSignature deployed to:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
