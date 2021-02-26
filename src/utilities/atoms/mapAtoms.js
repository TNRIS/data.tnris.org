import { atom } from "recoil";

export const mapAtom = atom({
  key: "mapAtom",
  default: null,
  dangerouslyAllowMutability: true,
});

export const hoverResourceAreaId = atom({
  key: "hoverResourceAreaIds",
  default: null,
});

export const mapHoverResourceAreaId = atom({
  key: "mapHoverResourceAreaId",
  default: null,
})
