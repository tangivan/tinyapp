const generateRandomString = require('./generateRandomString');
const bcrypt = require('bcryptjs');

const userHelperGenerator = (userDB, urlDB) => {

  const getUserByEmail = (email) => {
    let user;
    for (const key in userDB) {
      if (userDB[key].email === email) {
        user = userDB[key];
      }
    }
    if (!user) return null;

    return user;
  };

  const createUser = (email, password) => {
    const user = getUserByEmail(email);
    if (email === '' || password === '') {
      return {
        error: "Error: 400 Status Code<br/>Email or Password is empty.",
        statusCode: 400,
        data: null,
      };
    }
    if (user) {
      return {
        error: "Error: 400 Status Code<br/>User already exists",
        statusCode: 400,
        data: null,
      };
    }
    const id = generateRandomString();
    const newUser = {
      id,
      email,
      password
    };

    return {
      error: null,
      statusCode: null,
      data: newUser,
    };
  };

  /* authUser takes in an email and password and returns a error message, status code, and user if it exists */
  const authUser = (email, password) => {
    const user = getUserByEmail(email);
    if (email === '' || password === '') { //gary said change to !email || !password
      return {
        error: "Error: 400 Status Code<br/>Email or Password is empty.",
        statusCode: 400,
        data: null,
      };
    }
    if (!user) {
      return {
        error: "Error: 403 Status Code<br/>Email cannot be found.",
        statusCode: 403,
        data: null,
      };
    }

    return {
      error: null,
      statusCode: null,
      data: user,
    };
  };

  const urlsForUser = id => {
    const userUrls = {};
    for (const url in urlDB) {
      if (urlDB[url].userID === id) {
        userUrls[url] = urlDB[url];
      }
    }
    return userUrls;
  };

  return {
    getUserByEmail,
    authUser,
    createUser,
    urlsForUser,
  };
};

module.exports = userHelperGenerator;