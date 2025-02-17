const fs = require("fs");
const solanaWeb3 = require("@solana/web3.js");

async function main() {
  const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("mainnet-beta"), "confirmed");
  const publicKey = new solanaWeb3.PublicKey(process.env.CONTRACT_ADDRESS);

  try {
    const programAccountInfo = await connection.getAccountInfo(publicKey);
    if (programAccountInfo === null) {
      console.error("Program account not found");
      process.exit(1);
    }

    console.log("Program account info:", programAccountInfo);
    console.log("Verification successful for contract address:", publicKey.toString());
  } catch (error) {
    console.error("Error verifying Solana contract:", error);
    process.exit(1);
  }
}

main();

