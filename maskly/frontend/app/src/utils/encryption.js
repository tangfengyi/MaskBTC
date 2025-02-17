const crypto = require('crypto');

class Encryption {
    constructor(secretKey) {
        this.algorithm = 'aes-256-cbc';
        this.key = crypto.scryptSync(secretKey, 'salt', 32);
        this.iv = crypto.randomBytes(16);
    }

    encrypt(text) {
        const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    decrypt(encryptedText) {
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}

module.exports = Encryption;

