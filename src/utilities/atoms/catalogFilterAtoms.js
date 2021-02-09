import { atom, atomFamily } from "recoil";

export const sort = atom({
  key: "sort",
  default: "newest",
});

export const catalogFiltersOptions = atom({
  key: "catalogFilters",
  default: {
    availability: [
      "Download",
      "External Link",
      "Order Only",
      "WMS Service",
    ],
    category: [
      "Basemap",
      "Elevation",
      "Historic Imagery",
      "Hydrography",
      "Imagery",
      "Land Cover",
      "Lidar",
      "Reference Grid",
      "Transportation",
      "Weather",
    ],
    file_type: [
      "DEM",
      "DWG",
      "ECW",
      "ESRI Grid",
      "GDB",
      "GEOJSON",
      "IMG",
      "JP2",
      "JPG",
      "LAZ",
      "MrSID",
      "SHP",
      "TIFF",
      "TOPOJSON",
    ],
  },
});

export const catalogFilterFamily = atomFamily({
  key: "catalogFilterFamily",
  default: []
})