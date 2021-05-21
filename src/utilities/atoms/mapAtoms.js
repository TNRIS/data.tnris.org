import { atom } from "recoil";

export const mapAtom = atom({
  key: "mapAtom",
  default: null,
  dangerouslyAllowMutability: true,
});
