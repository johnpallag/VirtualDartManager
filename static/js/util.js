

/////////////////////////////////////////////////////////////////////////
// Returns the query string of the provided url as an object
// - Uses current window location if no string is provided
function GetUrlParams(urlOrQueryString) {
  if(urlOrQueryString === undefined)
    urlOrQueryString = window.location.toString();

  if ((i = urlOrQueryString.indexOf('?')) >= 0) {
    const queryString = urlOrQueryString.substring(i+1);
    if (queryString) {
      return queryString.split('&')
      .map(function(keyValueString) { return keyValueString.split('=') })
      .reduce(function(urlParams, [key, value]) {
        if (Number.isInteger(parseInt(value)) && parseInt(value) == value) {
          urlParams[key] = parseInt(value);
        } else {
          urlParams[key] = decodeURI(value);
        }
        return urlParams;
      }, {});
    }
  }
  return {};
}

/////////////////////////////////////////////////////////////////////////
