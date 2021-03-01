import { selectorFamily } from "recoil";
import { recursiveFetcher } from "../recursiveFetcher";

export const fetchCollectionByIdSelector = selectorFamily({
  key: "fetchCollectionByIdSelector",
  get: (collection_id) => async ({ get }) => {
    const response = await fetch(
      `https://api.tnris.org/api/v1/collections/${collection_id}`,
      
    );
    return response.json();
  },
});

export const fetchResourcesByCollectionIdSelector = selectorFamily({
  key: "fetchResourcesByCollectionIdSelector",
  get: (collection_id) => async ({ get }) => {
    const qquads = recursiveFetcher(
      `https://api.tnris.org/api/v1/resources/?collection_id=${collection_id}&area_type=qquad`,
      []
    );
    const counties = recursiveFetcher(
      `https://api.tnris.org/api/v1/resources/?collection_id=${collection_id}&area_type=quad`,
      []
    );
    const state = recursiveFetcher(
      `https://api.tnris.org/api/v1/resources/?collection_id=${collection_id}&area_type=county`,
      []
    );

    try {
      const response = await Promise.all([qquads, counties, state]);
      return {
        county: response[2],
        quad: response[1],
        qquad: response[0],
      };
    } catch (e) {
      console.log(e);
    }
  },
});
