/**
 * 
 * @param { Object|Object[] } params - Object containing the key and value of a single parameter
 * @param { string } params.key - The key of the search param to be changed
 * @param { string } params.value - The value to replace the current param value if params.ACTION is "set"
 * @param { string } params.ACTION - The method on URLSearchParams to execute, which is passed key, value as args
 * @param { string } currentSearchString - The current search string to manipulate as in window.location.search or useLocation().search
 */
export function changeParams(params, currentSearchString) {
  const s = new URLSearchParams(currentSearchString);

  const paramAction = (p) => s[p.ACTION](p.key, p.value);
  if (Array.isArray(params)) {
    params.forEach((param) => {
      paramAction(param);
    });
  }
  if (params.key && params.value) {
    paramAction(params);
  }

  return s.toString();
}
