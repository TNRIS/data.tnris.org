import { atom, DefaultValue } from "recoil";

const localStorageEffect = (key) => ({ setSelf, onSet }) => {
  const savedValue = localStorage.getItem(key);
  if (savedValue != null) {
    setSelf(JSON.parse(savedValue));
  }
  onSet((newValue) => {
    if (newValue instanceof DefaultValue) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(newValue));
    }
  });
};
export const cartAtom = atom({
  key: "cartAtom",
  default: null,
  effects_UNSTABLE: [localStorageEffect("data_shopping_cart")],
});

export const cartOpenAtom = atom({
    key: "cartOpenAtom",
    default: false,
})