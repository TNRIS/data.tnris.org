import { atom, selector } from "recoil";

export const geoFilterSearchTextAtom = atom({
  key: "geoFilterSearchTextAtom",
  default: "",
});
export const fetchGeocoderSearchResultsSelector = selector({
  key: "fetchGeoFilterSearchResultsSelector",
  get: async ({ get }) => {
    const searchText = get(geoFilterSearchTextAtom);
    const response = await fetch(
      `https://nominatim.tnris.org/search/${searchText}?format=geojson&polygon_geojson=1`
    );
    return response.json();
  },
});
export const geoSearchBboxAtom = atom({
  key: "geoFilterSelectedResultBboxSelector",
  default: null,
});

export const geoSearchSelectionAtom = atom({
  key: "geoSearchSelectionAtom",
  default: null
})

export const mapBoundsAtom = atom({
  key: "mapBoundsAtom",
  default: { lng: -99.341389, lat: 31.33 },
});
