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