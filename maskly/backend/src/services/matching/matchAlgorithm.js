class MatchAlgorithm {
    /**
     * @param {Object} userProfiles - A map of user profiles.
     * @param {Object} weights - Weights for different matching criteria.
     */
    constructor(userProfiles, weights = { interests: 10, location: 5 }) {
        this.userProfiles = userProfiles;
        this.weights = weights;
    }

    /**
     * Calculates the match score between two user profiles.
     * @param {Object} profile1 - The first user profile.
     * @param {Object} profile2 - The second user profile.
     * @returns {number} The calculated match score.
     */
    calculateMatchScore(profile1, profile2) {
        let score = 0;
        
        // 1. Check gender preference
        if (profile1.preferences.preferredGender !== 'any' && 
            profile1.preferences.preferredGender !== profile2.gender) {
            return 0; // No match if gender preference not met
        }

        // 2. Check age range
        const ageRange = profile1.preferences.ageRange;
        if (ageRange !== 'any') {
            const range = parseInt(ageRange.replace('±', ''));
            const minAge = profile1.age - range;
            const maxAge = profile1.age + range;
            if (profile2.age < minAge || profile2.age > maxAge) {
                return 0; // Age out of range
            }
        }

        // 3. Check location preference
        switch (profile1.preferences.locationPreference) {
            case 'same_city':
                if (profile1.location !== profile2.location) return 0;
                break;
            case 'different_city':
                if (profile1.location === profile2.location) return 0;
                break;
            // 'any' case falls through
        }

        // 4. Check recent matches
        const lastMatched = profile1.recentMatches?.[profile2.userId] || 0;
        if (Date.now() - lastMatched < 300000) { // 5 minutes
            return 0;
        }

        // Existing scoring logic
        if (profile1.interests.some(interest => 
           profile2.interests.includes(interest))) {
            score += this.weights.interests;
        }
        
        if (profile1.location === profile2.location) {
            score += this.weights.location;
        }

        return score;
    }

    /**
     * Finds the best matches for a given user.
     * @param {string} userId - The ID of the user to find matches for.
     * @param {number} limit - The maximum number of matches to return.
     * @returns {Array} An array of match objects sorted by score.
     */
    findBestMatches(userId, limit = 5) {
        const userProfile = this.userProfiles[userId];
        const matches = [];

        for (const [id, profile] of Object.entries(this.userProfiles)) {
            if (id !== userId) {
                const score = this.calculateMatchScore(userProfile, profile);
                matches.push({ userId: id, score });
            }
        }

        return matches.sort((a, b) => b.score - a.score).slice(0, limit);
    }

    /**
     * Updates the weights for matching criteria.
     * @param {Object} newWeights - The new weights to apply.
     */
    updateWeights(newWeights) {
        this.weights = { ...this.weights, ...newWeights };
    }
}

module.exports = MatchAlgorithm;

