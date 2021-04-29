export const recursiveCollectionFetcher = async (next, results) => {
  if (next) {
    const r = await fetch(next, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const j = await r.json();
    const concatResults = {
      ...j,
      results: results.results ? [...results.results, ...j.results] : j.results,
    };
    return recursiveCollectionFetcher(j.next, concatResults);
  } else {
    return results;
  }
};

export const recursiveAreaTypesFetcher = async (next, results) => {
  if (next) {
    const r = await fetch(next, { mode: "no-cors" });
    const j = await r.json();
    const concatResults = {
      ...j,
      results: results.results ? [...results.results, ...j.results] : j.results,
    };
    return recursiveAreaTypesFetcher(j.next, concatResults);
  } else {
    return results;
  }
};
