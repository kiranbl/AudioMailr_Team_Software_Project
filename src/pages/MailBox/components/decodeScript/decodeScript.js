// this script is created for validation testing of tokens
const jwt = require('jsonwebtoken');

const token = 'input token in here';

try {
  const decoded = jwt.decode(token);
  const currentTime = Math.floor(Date.now() / 1000);

  if (decoded.exp) {
    if (decoded.exp < currentTime) {
      console.log('Token has expired');
    } else {
      console.log('Token is still valid');
    }
  } else {
    console.log('Token does not have an expiration time');
  }
} catch (error) {
  console.error('Error decoding token:', error);
}