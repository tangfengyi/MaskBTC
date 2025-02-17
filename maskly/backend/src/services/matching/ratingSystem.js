class RatingSystem {
    constructor() {
        this.userRatings = {};
    }

    rateUser(userId, rating) {
        if (!this.userRatings[userId]) {
            this.userRatings[userId] = [];
        }
        this.userRatings[userId].push(rating);
    }

    getUserRating(userId) {
        const ratings = this.userRatings[userId];
        if (!ratings || ratings.length === 0) return 0;

        const total = ratings.reduce((sum, rating) => sum + rating, 0);
        return total / ratings.length;
    }
}

module.exports = RatingSystem;

