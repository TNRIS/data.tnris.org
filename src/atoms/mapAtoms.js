import { atom } from "recoil";

export const mapAtom = atom({
  key: "mapAtom",
  default: null,
  dangerouslyAllowMutability: true,
});

export const drawControlsAtom = atom({
  key: "drawControlsAtom",
  default: null,
  dangerouslyAllowMutability: true,
});
