import { atom } from "recoil";

export const mapAtom = atom({
  key: "mapAtom",
  default: null,
  dangerouslyAllowMutability: true,
});

export const mapHoverAreaId = atom({
  key: "mapHoverAreaId",
  default: null
})
