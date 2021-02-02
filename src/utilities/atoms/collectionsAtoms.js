import { selectorFamily } from "recoil";
import { recursiveFetcher } from "../recursiveFetcher";

export const fetchCollectionByIdSelector = selectorFamily({
  key: "fetchCollectionByIdSelector",
  get: (collection_id) => async ({ get }) => {
    const response = await fetch(
      `https://api.tnris.org/api/v1/collections/${collection_id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response.json();
  },
});

export const fetchResourcesByCollectionIdSelector = selectorFamily({
  key: "fetchResourcesByCollectionIdSelector",
  get: (collection_id) => async ({ get }) => {
    const qquads = fetch(
      `https://api.tnris.org/api/v1/resources/?collection_id=${collection_id}&area_type=qquad`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    ).then((resp) => resp.json());
    const counties = fetch(
      `https://api.tnris.org/api/v1/resources/?collection_id=${collection_id}&area_type=county`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    ).then((resp) => resp.json());
    const state = fetch(
      `https://api.tnris.org/api/v1/resources/?collection_id=${collection_id}&area_type=county`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    ).then((resp) => resp.json());
    try {
      const response = await Promise.all([qquads, counties, state]);
      return response;
    } catch (error) {
      console.log(error);
    }
  },
});
