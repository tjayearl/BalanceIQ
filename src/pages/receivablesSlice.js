import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

export const receivablesSlice = createSlice({
  name: 'receivables',
  initialState,
  reducers: {
    addReceivable: {
      reducer: (state, action) => {
        state.items.push(action.payload);
      },
      prepare: (name, amount) => {
        return {
          payload: {
            id: nanoid(),
            name,
            amount,
            status: 'unreceived', // Start as unreceived
          },
        };
      },
    },
    markAsReceived: (state, action) => {
      const receivableId = action.payload;
      const existingReceivable = state.items.find(
        (item) => item.id === receivableId
      );
      if (existingReceivable) {
        existingReceivable.status = 'received';
      }
    },
  },
});

export const { addReceivable, markAsReceived } = receivablesSlice.actions;

export default receivablesSlice.reducer;