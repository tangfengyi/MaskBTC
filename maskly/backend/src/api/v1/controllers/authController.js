const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

// Validate string input with updated max length
const validateString = (input, field, min = 1, max = 57344) => {
    if (typeof input !== 'string') {
        throw new Error(`${field} must be a string`);
    }
    if (input.length < min || input.length > max) {
        throw new Error(`${field} must be between ${min} and ${max} characters`);
    }
};

exports.register = async (req, res) => {
    try {
        const { 
            username, 
            email, 
            password,
            gender,
            age,
            location,
            preferences = {}
        } = req.body;

        // Validate required fields
        validateString(username, 'Username', 3, 30);
        validateString(email, 'Email');
        validateString(password, 'Password', 8, 30);

        // Validate optional fields
        if (gender && !['male', 'female', 'other'].includes(gender)) {
            throw new Error('Invalid gender value');
        }
        if (age && (age < 18 || age > 100)) {
            throw new Error('Age must be between 18 and 100');
        }
        if (preferences.preferredGender && !['male', 'female', 'any'].includes(preferences.preferredGender)) {
            throw new Error('Invalid preferred gender');
        }
        if (preferences.ageRange && !['±5', '±10', '±15', 'any'].includes(preferences.ageRange)) {
            throw new Error('Invalid age range');
        }
        if (preferences.locationPreference && !['same_city', 'different_city', 'any'].includes(preferences.locationPreference)) {
            throw new Error('Invalid location preference');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            gender,
            age,
            location,
            preferences
        });

        await newUser.save();
        res.status(201).json({ 
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                username: newUser.username,
                preferences: newUser.preferences
            }
        });
    } catch (error) {
        res.status(400).json({ 
            error: error.message || 'Registration failed' 
        });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '8h' }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                preferences: user.preferences
            }
        });
    } catch (error) {
        res.status(500).json({ 
            error: error.message || 'Login failed' 
        });
    }
};

