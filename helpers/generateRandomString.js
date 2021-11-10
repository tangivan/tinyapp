const generateRandomString = () => {
  return Math.floor((1 + Math.random()) * 100000000).toString(36);
};

module.exports = generateRandomString;