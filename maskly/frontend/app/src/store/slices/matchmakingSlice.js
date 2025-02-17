import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
    currentMatch: null,
    loading: false,
    error: null,
    preferences: {
        gender: 'any',
        ageRange: 'any',
        location: 'any'
    },
    skipCount: 5,
    cooldown: 0
};

export const startMatchmaking = createAsyncThunk(
    'matchmaking/start',
    async (preferences, { rejectWithValue }) => {
        try {
            const response = await api.post('/matchmaking/start', { preferences });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const skipMatch = createAsyncThunk(
    'matchmaking/skip',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post('/matchmaking/skip');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const matchmakingSlice = createSlice({
    name: 'matchmaking',
    initialState,
    reducers: {
        resetMatchmaking(state) {
            state.currentMatch = null;
            state.error = null;
        },
        updatePreferences(state, action) {
            state.preferences = {
                ...state.preferences,
                ...action.payload
            };
        },
        updateSkips(state, action) {
            state.skipCount = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(startMatchmaking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(startMatchmaking.fulfilled, (state, action) => {
                state.loading = false;
                state.currentMatch = action.payload;
                state.skipCount = action.payload?.remainingSkips ?? state.skipCount;
            })
            .addCase(startMatchmaking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || '匹配失败';
            })
            .addCase(skipMatch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(skipMatch.fulfilled, (state, action) => {
                state.loading = false;
                state.currentMatch = action.payload.match;
                state.skipCount = action.payload.remainingSkips;
                state.cooldown = 30;
            })
            .addCase(skipMatch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || '跳过失败';
                state.cooldown = action.payload?.cooldown || 0;
            });
    }
});

export const { resetMatchmaking, updatePreferences, updateSkips } = matchmakingSlice.actions;
export default matchmakingSlice.reducer;

