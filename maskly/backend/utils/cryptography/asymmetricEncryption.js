const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const getKeyPair = () => {
    const keyPairPath = path.resolve(__dirname, '../../keys/keypair.json');
    if (fs.existsSync(keyPairPath)) {
        return JSON.parse(fs.readFileSync(keyPairPath, 'utf8'));
    }
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });
    fs.mkdirSync(path.dirname(keyPairPath), { recursive: true });
    fs.writeFileSync(keyPairPath, JSON.stringify({ publicKey, privateKey }));
    return { publicKey, privateKey };
};

const encrypt = (text, publicKey) => {
    const buffer = Buffer.from(text, 'utf8');
    const encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString('base64');
};

const decrypt = (text, privateKey) => {
    const buffer = Buffer.from(text, 'base64');
    const decrypted = crypto.privateDecrypt(privateKey, buffer);
    return decrypted.toString('utf8');
};

module.exports = { getKeyPair, encrypt, decrypt };

