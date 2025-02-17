const path = require('path');
const fs = require('fs');

function getAllContracts() {
  const contracts = [];
  const CONTRACTS_DIR = path.join(__dirname, '../../maskly/blockchain/contracts');
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

module.exports = {
  // TypeChain configuration
  outDir: path.join(__dirname, '../../maskly/frontend/dapp/src/types'),
  target: 'ethers-v5',
  alwaysGenerateOverloads: true,
  discriminateTypes: true,
  tsNocheck: false,
  files: getAllContracts(),
};

