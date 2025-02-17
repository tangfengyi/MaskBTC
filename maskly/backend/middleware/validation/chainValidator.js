const chainUtils = require('../../utils/chainUtils');

const validateChain = (req, res, next) => {
    const { chainId } = req.body;

    if (!chainId) {
        return res.status(400).json({ message: 'Missing chainId' });
    }

    const supportedChains = chainUtils.getSupportedChains();
    if (!supportedChains.includes(chainId)) {
        return res.status(400).json({ message: 'Unsupported chainId' });
    }

    req.chainId = chainId;
    next();
};

module.exports = validateChain;

