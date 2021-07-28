import { atom, selector } from "recoil";

export const geoFilterSearchText = atom({
  key: "geoFilterSearchText",
  default: "",
});
export const fetchGeocoderSearchResults = selector({
  key: "fetchGeoFilterSearchResults",
  get: async ({ get }) => {
    const searchText = get(geoFilterSearchText);
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
export const mapBounds = atom({
  key: "mapBounds",
  default: { lng: -99.341389, lat: 31.33 },
});
