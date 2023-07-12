export const updateCart = state => {
  // calculate items price
  // state.itemsPrice = addDecimals(state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
  state.itemsPrice = state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  // calculate shipping price (if order over $100, free shipping, else shipping = $10)
  state.shippingPrice = state.itemsPrice > 100 ? 0 : 10;

  // calculate tax price (15%)
  state.taxPrice = Number((state.itemsPrice * 0.15).toFixed(2));

  // calculate total price
  state.totalPrice = (Number(state.itemsPrice) + Number(state.shippingPrice) + Number(state.taxPrice)).toFixed(2);

  // save all these prices to local storage
  localStorage.setItem('cart', JSON.stringify(state));

  return state;
};
