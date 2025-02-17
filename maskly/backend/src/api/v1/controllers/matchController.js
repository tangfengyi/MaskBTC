const Match = require('../../models/Match');
const User = require('../../models/User');
const matchmakingService = require('../../services/matching/matchAlgorithm');
const { DAILY_SKIP_LIMIT = 5, SKIP_COOLDOWN = 30 } = process.env;

// Skip validation logic
const handleSkipPenalties = async (user) => {
    const now = new Date();
    const lastReset = new Date(now);
    lastReset.setHours(0, 0, 0, 0); // Daily reset at midnight
    
    // Check daily reset
    if (user.lastSkipTime < lastReset) {
        user.skipCount = 0;
    }

    // Check skip limit
    if (user.skipCount >= DAILY_SKIP_LIMIT) {
        user.skipViolations += 1;
        await user.save();
        
        const penalty = {
            1: { message: 'Warning: Excessive skipping detected', cooldown: 60 },
            2: { message: 'Skipping restricted for 5 minutes', cooldown: 300 },
            3: { message: 'Matchmaking suspended for 1 hour', cooldown: 3600 }
        }[user.skipViolations] || { message: 'Matchmaking suspended for 24 hours', cooldown: 86400 };
        
        return { 
            error: `${penalty.message}. ${penalty.cooldown}s cooldown applied`,
            cooldown: penalty.cooldown
        };
    }

    return null;
};

// Handle skip request
exports.skipMatch = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const now = new Date();
        
        // Check cooldown
        if (user.lastSkipTime && (now - user.lastSkipTime) < SKIP_COOLDOWN * 1000) {
            const remaining = SKIP_COOLDOWN - Math.floor((now - user.lastSkipTime)/1000);
            return res.status(429).json({ 
                error: `Please wait ${remaining} seconds before skipping again`
            });
        }

        // Check penalties
        const penalty = await handleSkipPenalties(user);
        if (penalty) {
            user.lastSkipTime = now;
            await user.save();
            return res.status(429).json(penalty);
        }

        // Update user state
        user.skipCount += 1;
        user.lastSkipTime = now;
        await user.save();

        // Find new match
        const match = await matchmakingService.findMatch(user._id);
        
        if (!match) {
            return res.status(204).json({
                message: 'No new matches found',
                remainingSkips: DAILY_SKIP_LIMIT - user.skipCount
            });
        }

        res.json({
            success: true,
            match: {
                userId: match.userId,
                remainingSkips: DAILY_SKIP_LIMIT - user.skipCount
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Start matchmaking with preferences
exports.startMatchmaking = async (req, res) => {
    try {
        const userId = req.user.id;
        const preferences = req.body.preferences || {};

        // Get full user profile with preferences
        const user = await User.findById(userId)
            .select('gender age location preferences recentMatches')
            .lean();

        // Add user to matchmaking queue
        await matchmakingService.addToQueue({
            ...user,
            preferences: { ...user.preferences, ...preferences }
        });

        // Find match using the algorithm
        const match = await matchmakingService.findMatch(userId);

        if (match) {
            // Update recent matches
            await User.updateOne(
                { _id: userId },
                { $set: { [`recentMatches.${match.userId}`]: Date.now() } }
            );

            // Create match record
            const newMatch = new Match({
                users: [userId, match.userId],
                matchedAt: new Date()
            });
            await newMatch.save();

            return res.json({
                success: true,
                match: {
                    userId: match.userId,
                    matchId: newMatch._id,
                    matchedAt: newMatch.matchedAt
                }
            });
        }

        res.status(204).json({ 
            success: true, 
            message: 'No matches found - try expanding your preferences' 
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get match history for a user
exports.getMatches = async (req, res) => {
    try {
        const matches = await Match.find({ users: req.user.id })
            .sort({ matchedAt: -1 })
            .limit(50)
            .populate('users', 'username avatar');
            
        res.status(200).json(matches);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve matches'
        });
    }
};

