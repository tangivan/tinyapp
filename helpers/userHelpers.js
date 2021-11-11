const generateRandomString = require('./generateRandomString');
const bcrypt = require('bcryptjs');
const userHelperGenerator = (userDB, urlDB) => {

  const errorHandler = (user, shortURL = null) => {

  };

  const getUser = (email) => {
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
    const user = getUser(email);
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

  const authUser = (email, password) => {
    const user = getUser(email);
    if (email === '' || password === '') {
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
    console.log("called");
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
    getUser,
    authUser,
    createUser,
    urlsForUser,
  };
};

module.exports = userHelperGenerator;