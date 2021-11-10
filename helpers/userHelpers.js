const generateRandomString = require('./generateRandomString');
const userHelperGenerator = (userDB) => {

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
    if (user.password !== password) {
      return {
        error: "Error: 403 Status Code<br/>Password incorrect.",
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

  return {
    getUser,
    authUser,
    createUser,
  };
};

module.exports = userHelperGenerator;