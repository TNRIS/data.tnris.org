export const setCart = (cart) =>
  localStorage.setItem("data_shopping_cart", JSON.stringify(cart));
export const getCart = () =>
  JSON.parse(localStorage.getItem("data_shopping_cart"));
export const getCartItem = (key) => getCart[key];
export const addCartItem = (key, item) => {
  let cart = getCart();
  if (cart) {
    cart[key] = item;
  } else {
      cart = {[key]: item}
  }
  setCart(cart);
  return getCart();
};
export const deleteCartItem = (key) => {
  const cart = getCart();
  delete cart[key];
  setCart(cart);

  return getCart();
};
