const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ABI Generation Configuration
const CONTRACTS_DIR = path.join(__dirname, '../../maskly/blockchain/contracts');
const OUTPUT_DIR = path.join(__dirname, '../../maskly/frontend/dapp/public/contracts');

function getAllContracts() {
  const contracts = [];
  const walkDir = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        walkDir(fullPath); // Recursively walk subdirectories
      } else if (file.endsWith('.sol')) {
        contracts.push(fullPath);
      }
    }
  };
  walkDir(CONTRACTS_DIR);
  return contracts;
}

function generateABIs() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const contracts = getAllContracts();

  contracts.forEach(contractPath => {
    try {
      const contractName = path.basename(contractPath, '.sol');
      const outputPath = path.join(OUTPUT_DIR, `${contractName}.json`);

      // Compile contract and capture output
      let compileSuccess = false;
      try {
        execSync(`solc --abi ${contractPath} -o ${OUTPUT_DIR}`, { stdio: 'inherit' });
        compileSuccess = true;
      } catch (compileError) {
        console.error(`Compilation failed for ${contractPath}:`, compileError.message);
      }
      if (!compileSuccess) return; // Skip further processing if compilation fails

      // Check if ABI file exists before reading
      if (!fs.existsSync(outputPath)) {
        console.error(`ABI file not found for ${contractPath}`);
        return;
      }

      // Read and save ABI
      try {
        const abiContent = fs.readFileSync(outputPath, 'utf8');
        fs.writeFileSync(outputPath, JSON.stringify(JSON.parse(abiContent), null, 2));
        console.log(`Generated ABI for ${contractName}`);
      } catch (readError) {
        console.error(`Error reading or saving ABI for ${contractName}:`, readError.message);
      }
    } catch (error) {
      console.error(`Unexpected error processing ${contractPath}:`, error.message);
    }
  });
}

generateABIs();

