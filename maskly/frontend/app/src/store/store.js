import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import walletReducer from './slices/walletSlice';
import matchmakingReducer from './slices/matchmakingSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        wallet: walletReducer,
        matchmaking: matchmakingReducer,
    },
});

export default store;

