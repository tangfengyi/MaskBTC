const { body, validationResult } = require('express-validator');

const validateSchema = (schema) => {
    return [
        ...schema,
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ];
};

module.exports = validateSchema;

