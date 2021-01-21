export const recursiveFetcher = async (next, results) => {
    if (next) {
      const r = await fetch(next, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      const j = await r.json()
      const concatResults = [...results, ...j.results]
      return recursiveFetcher(j.next, concatResults)
    }
    else {
        return results
    }
  };