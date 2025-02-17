const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    walletAddress: { type: String, unique: true },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    age: { type: Number, min: 18 },
    location: String,
    preferences: {
        preferredGender: { type: String, enum: ['male', 'female', 'any'], default: 'any' },
        ageRange: {
            type: String, 
            enum: ['±5', '±10', '±15', 'any'],
            default: 'any'
        },
        locationPreference: {
            type: String,
            enum: ['same_city', 'different_city', 'any'],
            default: 'any'
        }
    },
    createdAt: { type: Date, default: Date.now },
    skipCount: {
        type: Number,
        default: 0
    },
    lastSkipTime: Date,
    skipViolations: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('User', UserSchema);

