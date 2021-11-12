const generateRandomString = require('./generateRandomString');

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

  /*Takes in an email and password and performs checks for input errors
    returns a new user object ready to have it's password hashed */
  const createUser = (email, password) => {
    const user = getUserByEmail(email);
    if (!email || !password) {
      return {
        error: "Error: 400 Status Code<br/>Email or Password is empty.",
        statusCode: 400,
        user: null,
      };
    }
    if (user) {
      return {
        error: "Error: 400 Status Code<br/>User already exists",
        statusCode: 400,
        user: null,
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
      user: newUser,
    };
  };

  /*This function originally handled password matching as well.
    But due to using async bcrypt and needing to redirect, I moved
    it back to express_server.js */
  const authErrorHandler = (email, password) => {
    const user = getUserByEmail(email);
    if (!email || !password) {
      return {
        error: "Error: 400 Status Code<br/>Email or Password is empty.",
        statusCode: 400,
        user: null,
      };
    }
    if (!user) {
      return {
        error: "Error: 403 Status Code<br/>Email cannot be found.",
        statusCode: 403,
        user: null,
      };
    }
    return {
      error: null,
      statusCode: null,
      user: user,
    };
  };

  //Takes in an id and returns all urls belonging to the id
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
    authErrorHandler,
    createUser,
    urlsForUser,
  };
};

module.exports = userHelperGenerator;