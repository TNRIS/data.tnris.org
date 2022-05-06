import { message } from "antd";
import { atom, selector, selectorFamily } from "recoil";
import { AREA_TYPES } from "../constants/areaTypes";
import {
  collectionCoverageLayerStyle,
  collectionCoverageOutlineLayerStyle,
} from "../constants/mapbox-styles/collectionExtent";
import {
  addCoverageLayer,
  removeCoverageLayer,
} from "../utilities/mapHelpers/highlightHelpers";
import { recursiveAreaTypesFetcher } from "../utilities/recursiveFetcher";
import { mapAtom } from "./mapAtoms";

export const fetchCollectionByIdSelector = selectorFamily({
  key: "fetchCollectionByIdSelector",
  get:
    (collection_id) =>
    async ({ get }) => {
      const response = await fetch(
        `https://api.tnris.org/api/v1/collections/${collection_id}`
      );
      if (!response.ok) {
        const historicalresponse = await fetch(
          `https://api.tnris.org/api/v1/historical/collections/${collection_id}`
        );
        return historicalresponse.json();
      } else {
        return response.json();
      }
    },
});

export const fetchAreaTypesByCollectionIdSelector = selectorFamily({
  key: "fetchAreaTypesByCollectionIdSelector",
  get:
    (collection_id) =>
    async ({ get }) => {
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

export const fetchResourcesByCollectionIdAndAreaTypeIDSelector = selectorFamily(
  {
    key: "fetchResourcesByCollectionIdAndAreaTypeIDSelector",
    get:
      ({ collectionId, areaTypeId }) =>
      async ({ get }) => {
        const response = await fetch(
          `https://api.tnris.org/api/v1/resources?collection_id=${collectionId}&area_type_id=${areaTypeId}`
        );
        return response.json();
      },
  }
);

export const showCollectionExtentByCollectionId = selectorFamily({
  key: "fetchCollectionExtentByCollectionId",
  set:
    ({
      collectionId,
      outlineStyle,
      fillStyle,
    }) =>
    async ({ get }) => {
      const map = get(mapAtom);
      const response = await fetch(
        `https://api.tnris.org/api/v1/collections_catalog?collection_id=${collectionId}`
      );
      const resp = await response.json();
      const geom = resp.results[0].the_geom;

      addCoverageLayer(map, geom, outlineStyle, fillStyle);
      message.info({
        content: `${resp.results[0].name} extent layer added to map`,
        key: "extentLayerNotification",
        style: { position: "fixed", top: "4.8rem", right: "2.4rem" },
      });
      console.log("added collection extent layer to map");
    },
});

export const removeCollectionExtent = selector({
  key: "removeCollectionExtent",
  set: ({ get }) => {
    const map = get(mapAtom);
    removeCoverageLayer(map);
    console.log("removed collection extent layer from map");
  },
});

export const collectionAreasMapSelectionAtom = atom({
  key: "collectionAreasMapSelectionAtom",
  default: [],
});

export const collectionAreasMapHoverAtom = atom({
  key: "collectionAreasMapHoverAtom",
  default: [],
});
