// this function takes cookie's name and retrieve token from cookie
export function getCookieValue(name) {
    let cookieArray = document.cookie.split('; ');
    let cookieObject = {};
  
    cookieArray.forEach(cookie => {
      let [key, value] = cookie.split('=');
      cookieObject[key] = value;
    });
  
    return cookieObject[name];
  }
  
  export const getStorageData = (keyName, defaultValue) => {
    const cookieValue = getCookieValue(keyName);
    if (cookieValue) {
      // If the cookie is located and its value if valid, return the token
      return cookieValue;
    }
    // Otherwise, it returns the defaultValue
    return defaultValue;
  };