export function fuzzySearch(keyword, corpus) {
  const forLen = keyword.length;
  const corpLen = corpus.length;

  if (forLen > corpLen) {
    return false;
  }
  if (forLen === corpLen) {
    return keyword === corpus;
  }
  outer: for (var i = 0, j = 0; i < forLen; i++) {
    const s = keyword.charCodeAt(i);
    while (j < corpLen) {
      if (corpus.charCodeAt(j++) === s) {
        continue outer;
      }
    }
    return false;
  }
  return true;
}

// break string into token "shingles" of length k at each index of i - k + 1
export function shingle(doc, k = 3) {
  let shingles = Array.from(Array(doc.length - k + 1));
  return shingles.map((v, i) => doc.slice(i, i + k));
}
// generate set of unique token values in a,b arrays
export function union(a, b) {
  let A = new Set([...a]);
  let B = new Set([...b]);
  let union = new Set([...A, ...B]);

  return union;
}
// generate set of common and unique token values in a,b arrays
export function intersection(a, b) {
  let A = new Set([...a]);
  let B = new Set([...b]);
  let intersection = new Set([...A].filter((x) => B.has(x)));

  return intersection;
}
// generate jaccard index where jaccardIndex = Intersection of A & B divided by the Union of A & B
export function jaccard(doc, query){
    return 1.0 * (intersection(doc,query)).size / (union(doc,query)).size
}
// a function which generates shingled jaccardIndex taking k as the shard/shingle length with default length of 3
export function shingledJaccard(doc,query, k=3){
    const s_a = shingle(doc, k)
    const s_b = shingle(query, k)

    return jaccard(s_a, s_b)
}