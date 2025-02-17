import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { contractInstance } from '../../services/blockchain/contractInteractions';

// 异步操作：扣除余�?
export const deductBalance = createAsyncThunk(
    'wallet/deductBalance',
    async (amount, { getState }) => {
        const { wallet } = getState().wallet;
        try {
            const tx = await contractInstance.methods.deductHCoin(amount)
                .send({ from: wallet.address });
            return tx.events.BalanceUpdated.returnValues.newBalance;
        } catch (error) {
            throw new Error('扣费失败: ' + error.message);
        }
    }
);

// 异步操作：检查余�?
export const checkBalance = createAsyncThunk(
    'wallet/checkBalance',
    async (_, { getState }) => {
        const { wallet } = getState().wallet;
        try {
            return await contractInstance.methods.getBalance(wallet.address)
                .call();
        } catch (error) {
            throw new Error('获取余额失败: ' + error.message);
        }
    }
);

const initialState = {
    wallet: null,
    balance: 0,
    loading: false,
    error: null,
};

const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        connectWalletStart(state) {
            state.loading = true;
            state.error = null;
        },
        connectWalletSuccess(state, action) {
            state.wallet = action.payload;
            state.loading = false;
        },
        connectWalletFailure(state, action) {
            state.error = action.payload;
            state.loading = false;
        },
        updateBalance(state, action) {
            state.balance = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // 处理deductBalance
            .addCase(deductBalance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deductBalance.fulfilled, (state, action) => {
                state.balance = action.payload;
                state.loading = false;
            })
            .addCase(deductBalance.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
            // 处理checkBalance
            .addCase(checkBalance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkBalance.fulfilled, (state, action) => {
                state.balance = action.payload;
                state.loading = false;
            })
            .addCase(checkBalance.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            });
    },
});

export const { connectWalletStart, connectWalletSuccess, connectWalletFailure, updateBalance } = walletSlice.actions;

export default walletSlice.reducer;

