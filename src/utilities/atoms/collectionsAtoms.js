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
    const qquads = recursiveFetcher(
      `https://api.tnris.org/api/v1/resources/?collection_id=${collection_id}&area_type=qquad`,
      []
    );
    /* fetch(
      `https://api.tnris.org/api/v1/resources/?collection_id=${collection_id}&area_type=qquad`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    ).then((resp) => resp.json()); */
    const counties = recursiveFetcher(
      `https://api.tnris.org/api/v1/resources/?collection_id=${collection_id}&area_type=quad`,
      []
    );
    /* fetch(
      `https://api.tnris.org/api/v1/resources/?collection_id=${collection_id}&area_type=quad`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    ).then((resp) => resp.json()); */
    const state = recursiveFetcher(
      `https://api.tnris.org/api/v1/resources/?collection_id=${collection_id}&area_type=county`,
      []
    );

    /* fetch(
      `https://api.tnris.org/api/v1/resources/?collection_id=${collection_id}&area_type=county`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    ).then((resp) => resp.json()); */
    try {
      const response = await Promise.all([qquads, counties, state]);
      return {
        total: response.reduce((acc, cur) => acc + cur.count, 0),
        counties: response[2],
        quads: response[1],
        qquads: response[0],
      };
    } catch (e) {
      console.log(e);
    }
  },
});
