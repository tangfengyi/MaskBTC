const rateLimit = require('express-rate-limit');

const createRateLimiter = (options) => {
    const { windowMs, max, message } = options;
    return rateLimit({
        windowMs: windowMs || 15 * 60 * 1000, // 15 minutes
        max: max || 100, // limit each IP to 100 requests per windowMs
        message: message || 'Too many requests from this IP, please try again later.',
    });
};

module.exports = {
    globalLimiter: createRateLimiter({}),
    authLimiter: createRateLimiter({ windowMs: 5 * 60 * 1000, max: 20 }),
    apiLimiter: createRateLimiter({ windowMs: 1 * 60 * 1000, max: 50 }),
};


