const ethers = require('ethers');

const authenticateSignature = async (req, res, next) => {
    const { message, signature, address } = req.body;

    if (!message || !signature || !address) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const recoveredAddress = ethers.utils.verifyMessage(message, signature);
        if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
            return res.status(401).json({ message: 'Invalid signature' });
        }
        req.authenticatedAddress = address;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Signature verification failed' });
    }
};

module.exports = authenticateSignature;

