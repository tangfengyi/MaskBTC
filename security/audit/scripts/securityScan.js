const shell = require('shelljs');
const fs = require('fs');
const path = require('path');

class SecurityScanner {
    constructor(projectRoot) {
        this.projectRoot = projectRoot;
    }

    /**
     * Runs security scans on smart contracts
     * @returns {Promise<void>}
     */
    async runScans() {
        try {
            console.log('Running security scans...');
            
            // Run Slither analysis
            const slitherConfig = path.join(this.projectRoot, 'tooling/security/slither-config.json');
            const slitherCmd = `slither ${this.projectRoot}/maskly/blockchain/contracts --config ${slitherConfig}`;
            console.log('Running Slither analysis...');
            const slitherResult = shell.exec(slitherCmd);
            if (slitherResult.code !== 0) {
                throw new Error(`Slither scan failed: ${slitherResult.stderr}`);
            }
            console.log('Slither analysis completed:', slitherResult.stdout);
            
            // Run Mythril analysis
            const mythrilConfig = path.join(this.projectRoot, 'tooling/security/mythril-config.yml');
            const mythrilCmd = `myth analyze ${this.projectRoot}/maskly/blockchain/contracts -c ${mythrilConfig}`;
            console.log('Running Mythril analysis...');
            const mythrilResult = shell.exec(mythrilCmd);
            if (mythrilResult.code !== 0) {
                throw new Error(`Mythril scan failed: ${mythrilResult.stderr}`);
            }
            console.log('Mythril analysis completed:', mythrilResult.stdout);
            
            // Save results to report file
            const reportPath = path.join(this.projectRoot, 'security/audit/security-scan-report.txt');
            const reportContent = `
Security Scan Report
====================

Slither Results:
${slitherResult.stdout}

Mythril Results:
${mythrilResult.stdout}
`;
            fs.writeFileSync(reportPath, reportContent);
            console.log('Security scan report saved to:', reportPath);
        } catch (error) {
            console.error('Error during security scan:', error);
            throw error;
        }
    }
}

module.exports = SecurityScanner;
