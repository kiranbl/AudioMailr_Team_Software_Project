// this function takes cookie's name and retrieve token from cookie
export function getCookieValue(name) {
    let cookieArray = document.cookie.split('; ');
    let cookieObject = {};
  
    cookieArray.forEach(cookie => {
      let [key, value] = cookie.split('=');
      const decodedValue = decodeURIComponent(value);
      if (decodedValue.startsWith('j:')) {
        cookieObject[key] = decodedValue.slice(2);
      } else {
        cookieObject[key] = decodedValue;
      }
    });
  
    return cookieObject[name];
  }
  
  export const getStorageData = (keyName, defaultValue) => {
    const cookieValue = getCookieValue(keyName);
    if (cookieValue) {
      const parsedCookieValue = JSON.parse(cookieValue);
      return parsedCookieValue.token;
    }
    // Otherwise, it returns the defaultValue
    return defaultValue;
  };

  export const getTokenFromStorage = (keyName, defaultValue) => {
    const cookieValue = getCookieValue(keyName);
    if (cookieValue) {
      const parsedCookieValue = JSON.parse(decodeURIComponent(cookieValue));
      return parsedCookieValue.token;
    }
    return defaultValue;
  };

  export const getEmailFromStorage = (keyName, defaultValue) => {
    const cookieValue = getCookieValue(keyName);
    if (cookieValue) {
      const parsedCookieValue = JSON.parse(decodeURIComponent(cookieValue));
      return parsedCookieValue.emailaddress;
    }
    return defaultValue;
  };
  
  