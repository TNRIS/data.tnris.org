import { atom, selector } from "recoil";

export const geoFilterSearchText = atom({
  key: "geoFilterSearchText",
  default: "",
});

export const fetchGeofilterSearchResults = selector({
  key: "fetchGeoFilterSearchResults",
  get: async ({ get }) => {
    const searchText = get(geoFilterSearchText);
    const response = await fetch(
      `https://nominatim.tnris.org/search/${searchText}?format=geojson&polygon_geojson=1`
    );
    return response.json();
  },
});

export const geoFilterSelectedResult = atom({
  key: "geoFitlerSelectedResult",
  default: "",
});

export const hoverPreviewCoverageCounties = atom({
    key: "hoverPreviewCoverageCounties",
    default: []
})