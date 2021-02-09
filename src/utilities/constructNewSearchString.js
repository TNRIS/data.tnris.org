/**
 * Pure function which takes the current search string, a key-value pair, and a statement to alter them. Returns a new search string after with the changed key-value
 * @param { string } paramKey - the key value of the parameter to edit.
 * @param { any } paramValue - the current parameter value, or null 
 * @param { any } newParamValue - a variable, statement, or function that returns or outputs the intended new value
 * @param { string } currentSearchString - the current search string, as in ${window.location.search}
 */

export const constructNewSearchString = (
  paramKey,
  paramValue,
  newParamValue,
  currentSearchString
) => {
  if (paramValue) {
    // if the given param already has a value in the query string, simply replace it
    console.log(1, paramKey, paramValue, newParamValue)
    return currentSearchString.replace(
      `${paramKey}=${paramValue}`,
      `${paramKey}=${newParamValue}`
    );
  } else {
    // if not already in the search string, check if the search string has ANY values at all
    console.log(2)
    if (currentSearchString) {
      console.log('2a', paramKey, paramValue, newParamValue)
      // if there is a search string, just return a string concatenating the new value onto the old value
      return `${currentSearchString}&${paramKey}=${newParamValue}`;
    } else {
      console.log('2b', paramKey, paramValue, newParamValue)
      return `?${paramKey}=${newParamValue}`;
    }
  }
};