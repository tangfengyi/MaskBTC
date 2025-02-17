import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        fetchUserStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchUserSuccess(state, action) {
            state.user = action.payload;
            state.loading = false;
        },
        fetchUserFailure(state, action) {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const { fetchUserStart, fetchUserSuccess, fetchUserFailure } = userSlice.actions;

export default userSlice.reducer;

