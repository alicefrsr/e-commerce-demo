import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils';

const initialState = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      // item already in cart?
      const existItem = state.cartItems.find(x => x._id === item._id);
      if (existItem) {
        // item already in cart, update qty
        state.cartItems = state.cartItems.map(x => (x._id === existItem._id ? item : x));
      } else {
        // item not already in cart, add it to cart
        state.cartItems = [...state.cartItems, item];
      }
      // price calculations moved to updateCart function in cartUtils
      // // calculate item's price
      // state.itemPrice = addDecimals(state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
      // // calculate shipping price (if order over $100, free shipping, else shipping = $10)
      // state.shippingPrice = addDecimals(state.itemPrice > 100 ? 0 : 10);
      // // calculate tax price (15%
      // state.taxPrice = addDecimals(Number((state.itemPrice * 0.15).toFixed(2)));
      // // calculate total price
      // state.totalPrice = (Number(state.itemPrice) + Number(state.shippingPrice) + Number(state.taxPrice)).toFixed(2);

      // // save all these prices to local storage
      // localStorage.setItem('cart', JSON.stringify(state));

      return updateCart(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(x => x._id !== action.payload);

      return updateCart(state);
    },
    // use in ShippingScreen
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },
    // use in PaymentScreen
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },
    // use in PlaceOrderScreen
    clearCartItems: (state, action) => {
      state.cartItems = [];
      return updateCart(state);
    },
  },
});

// to use any of the functions created we need them export as actions
export const { addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, clearCartItems } = cartSlice.actions;
// we also need to export the reducer altogether to bring it in store file
export default cartSlice.reducer;
