const IPFS = require('ipfs-http-client');

class IPFSService {
    constructor(ipfsEndpoint) {
        this.ipfs = IPFS.create({ url: ipfsEndpoint });
    }

    async addFile(fileContent) {
        const { cid } = await this.ipfs.add(fileContent);
        return cid.toString();
    }

    async getFile(cid) {
        const chunks = [];
        for await (const chunk of this.ipfs.cat(cid)) {
            chunks.push(chunk);
        }
        return Buffer.concat(chunks).toString();
    }
}

module.exports = IPFSService;

