import { atom, selectorFamily } from "recoil";
import { AREA_TYPES } from "../constants/areaTypes";
import {
  recursiveAreaTypesFetcher,
} from "../recursiveFetcher";

export const fetchCollectionByIdSelector = selectorFamily({
  key: "fetchCollectionByIdSelector",
  get: (collection_id) => async ({ get }) => {
    const response = await fetch(
      `http://localhost:8000/api/v1/collections/${collection_id}`
    );
    if (!response.ok) {
      const historicalresponse = await fetch(
        `http://localhost:8000/api/v1/historical/collections/${collection_id}`
      );
      return historicalresponse.json();
    } else {
      return response.json();
    }
  },
});

export const fetchAreaTypesByCollectionIdSelector = selectorFamily({
  key: "fetchAreaTypesByCollectionIdSelector",
  get: (collection_id) => async ({ get }) => {
    const mappedPromises = AREA_TYPES.map((areatype) =>
      recursiveAreaTypesFetcher(
        `https://mapserver.tnris.org/?map=/tnris_mapfiles/download_areas.map&SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=collection_query&outputformat=geojson&SRSNAME=EPSG:4326&AreaType=${areatype}&Collection=${collection_id}`,
        []
      )
    );

    try {
      const response = await Promise.all(mappedPromises);
      const returnObject = {};
      AREA_TYPES.forEach((v, i) => {
        if (response[i]["features"].length) {
          returnObject[v] = response[i];
        }
      });
      return returnObject;
    } catch (e) {
      console.log(e);
    }
  },
});

export const fetchResourcesByCollectionIdAndAreaTypeIDSelector = selectorFamily({
  key: "fetchResourcesByCollectionIdAndAreaTypeIDSelector",
  get: ({collectionId, areaTypeId}) => async ({ get }) => {
    const response = await fetch(
      `http://localhost:8000/api/v1/resources?collection_id=${collectionId}&area_type_id=${areaTypeId}`
    );
    return response.json();
  }
})

export const collectionAreasMapSelectionAtom = atom({
  key: "collectionAreasMapSelectionAtom",
  default: []
})

export const collectionAreasMapHoverAtom = atom({
  key: "collectionAreasMapHoverAtom",
  default: []
})

