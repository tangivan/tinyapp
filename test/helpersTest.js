const { assert } = require('chai');
const testUsers = require("../data/userData");
const urlDatabase = require("../data/urlData");
const userHelperGenerator = require("../helpers/helpers");
const { getUserByEmail, authErrorHandler, createUser, urlsForUser } = userHelperGenerator(testUsers, urlDatabase);
const generateRandomString = require('../helpers/generateRandomString');

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com");
    const expectedUserID = "aJ48lW";

    assert.equal(user.id, expectedUserID);
  });

  it('should return undefined with a non-existant email', function() {
    const user = getUserByEmail("sdfsdfsdfsd");
    const expectedUserID = undefined;

    assert.equal(user, expectedUserID);
  });
});

describe('authUser', function() {
  it('Should return error when email is empty', function() {
    const { user, error, statusCode } = authErrorHandler("", "abc");
    const expectedData = null;
    const expectedError = "Error: 400 Status Code<br/>Email or Password is empty.";
    const expectedStatusCode = 400;
    assert.equal(user, expectedData);
    assert.equal(error, expectedError);
    assert.equal(statusCode, expectedStatusCode);
  });

  it('Should return error when password is empty', function() {
    const { user, error, statusCode } = authErrorHandler("ivan@ivan.com", "");
    const expectedData = null;
    const expectedError = "Error: 400 Status Code<br/>Email or Password is empty.";
    const expectedStatusCode = 400;
    assert.equal(user, expectedData);
    assert.equal(error, expectedError);
    assert.equal(statusCode, expectedStatusCode);
  });

  it('Should return error when both email and password are empty', function() {
    const { user, error, statusCode } = authErrorHandler("", "");
    const expectedData = null;
    const expectedError = "Error: 400 Status Code<br/>Email or Password is empty.";
    const expectedStatusCode = 400;
    assert.equal(user, expectedData);
    assert.equal(error, expectedError);
    assert.equal(statusCode, expectedStatusCode);
  });

  it('Should return error email is non-existant', function() {
    const { user, error, statusCode } = authErrorHandler("asdfsd@sldflds.com", "asdkflsd");
    const expectedData = null;
    const expectedError = "Error: 403 Status Code<br/>Email cannot be found.";
    const expectedStatusCode = 403;
    assert.equal(user, expectedData);
    assert.equal(error, expectedError);
    assert.equal(statusCode, expectedStatusCode);
  });

  it('Should return user if email exists', function() {
    const { user, error, statusCode } = authErrorHandler("ivan@ivan.com", "abc");
    const expectedData = {
      id: "2jv0ee",
      email: "ivan@ivan.com",
      password: "$2a$10$k87Q4bOTtgWWUa8AI7ezQOziftp2wvb0yVIlwfsQmPgI60Rq60jFO"
    };
    const expectedError = null;
    const expectedStatusCode = null;
    assert.deepEqual(user, expectedData);
    assert.equal(error, expectedError);
    assert.equal(statusCode, expectedStatusCode);
  });
});

describe('createUser', function() {
  it('Should return error when email is empty', function() {
    const { user, error, statusCode } = createUser("", "abc");
    const expectedData = null;
    const expectedError = "Error: 400 Status Code<br/>Email or Password is empty.";
    const expectedStatusCode = 400;
    assert.equal(user, expectedData);
    assert.equal(error, expectedError);
    assert.equal(statusCode, expectedStatusCode);
  });

  it('Should return error when password is empty', function() {
    const { user, error, statusCode } = createUser("ivan@ivan.com", "");
    const expectedData = null;
    const expectedError = "Error: 400 Status Code<br/>Email or Password is empty.";
    const expectedStatusCode = 400;
    assert.equal(user, expectedData);
    assert.equal(error, expectedError);
    assert.equal(statusCode, expectedStatusCode);
  });

  it('Should return error when both email and password are empty', function() {
    const { user, error, statusCode } = createUser("", "");
    const expectedData = null;
    const expectedError = "Error: 400 Status Code<br/>Email or Password is empty.";
    const expectedStatusCode = 400;
    assert.equal(user, expectedData);
    assert.equal(error, expectedError);
    assert.equal(statusCode, expectedStatusCode);
  });

  it('Should return new user if email is non-existant', function() {
    const { user, error, statusCode } = createUser("abc@def.com", "abc");
    const expectedData = "abc@def.com";
    const expectedError = null;
    const expectedStatusCode = null;
    assert.equal(user.email, expectedData);
    assert.equal(error, expectedError);
    assert.equal(statusCode, expectedStatusCode);
  });

  it('Should return error if email exists', function() {
    const { user, error, statusCode } = createUser("ivan@ivan.com", "abc");
    const expectedData = null;
    const expectedError = "Error: 400 Status Code<br/>User already exists";
    const expectedStatusCode = 400;
    assert.deepEqual(user, expectedData);
    assert.equal(error, expectedError);
    assert.equal(statusCode, expectedStatusCode);
  });
});

describe('urlsForUser', function() {
  it('urlsForUser should return urls for the correct id', function() {
    const urls = urlsForUser("aJ48lW");
    const expectedUrls = {
      b6UTxQ: {
        longURL: "https://www.tsn.ca",
        userID: "aJ48lW"
      },
      i3BoGr: {
        longURL: "https://www.google.ca",
        userID: "aJ48lW"
      }
    };
    assert.deepEqual(urls, expectedUrls);
  });
  it('urlsForUser should return no an empty object if the id does not have any', function() {
    const urls = urlsForUser("abdefg");
    const expectedUrls = {};
    assert.deepEqual(urls, expectedUrls);
  });
});

describe('generateRandomString', function() {

  it('String generated should have a length of 6', function() {
    const randomString = generateRandomString();
    assert.equal(randomString.length, 6);
  });

  it('Two generated strings should not be equal.', function() {
    const randomString1 = generateRandomString();
    const randomString2 = generateRandomString();
    assert.notEqual(randomString1, randomString2);
  });
});