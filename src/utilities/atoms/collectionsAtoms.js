import { selectorFamily } from "recoil";
import { AREA_TYPES } from "../constants/areaTypes";
import { recursiveFetcher } from "../recursiveFetcher";

export const fetchCollectionByIdSelector = selectorFamily({
  key: "fetchCollectionByIdSelector",
  get: (collection_id) => async ({ get }) => {
    const response = await fetch(
      `http://localhost:8000/api/v1/collections/${collection_id}`
    );
    return response.json();
  },
});

export const fetchResourcesByCollectionIdSelector = selectorFamily({
  key: "fetchResourcesByCollectionIdSelector",
  get: (collection_id) => async ({ get }) => {
    const mappedPromises = AREA_TYPES.map((areatype) =>
      recursiveFetcher(
        `http://localhost:8000/api/v1/resources/?collection_id=${collection_id}&area_type=${areatype}`,
        []
      )
    );

    try {
      const response = await Promise.all(mappedPromises);
      const returnObject = {};
      AREA_TYPES.forEach((v, i) => (returnObject[v] = response[i]));
      return returnObject;
    } catch (e) {
      console.log(e);
    }
  },
});
