import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bank: 0,
  mpesa: 0,
};

export const balanceSlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {
    // Action to set both balances at once
    setBalances: (state, action) => {
      state.bank = action.payload.bank;
      state.mpesa = action.payload.mpesa;
    },
  },
});

// Export the action creator
export const { setBalances } = balanceSlice.actions;

// Export the reducer
export default balanceSlice.reducer;