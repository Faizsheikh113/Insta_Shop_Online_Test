import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: [],
    reducers: {
        addToCart: (state, action) => {
            state.push(action.payload);
        },
        removeFromCart: (state, action) => {
            return state.filter(item => item.id !== action.payload);
        },
        clearCart: () => {
            return [];
        },
        updateQuantity: (state, action) => {
            const { itemId, quantity } = action.payload;
            const itemIndex = state.findIndex(item => item.id === itemId);
            if (itemIndex !== -1) {
                state[itemIndex].quantity = quantity;
            }
        },
    },
});

export const { addToCart, removeFromCart, clearCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;