const express = require("express");
const morgan = require("morgan");
const cookieSession = require('cookie-session');
const generateRandomString = require("./helpers/generateRandomString");
const userHelperGenerator = require("./helpers/helpers");
const bcrypt = require("bcryptjs");

//Setup database with userHelperGenerator
const userDatabase = require("./data/userData");
const urlDatabase = require("./data/urlData");
const { authUser, createUser, urlsForUser } = userHelperGenerator(userDatabase, urlDatabase);

const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

// GET methods
app.get("/", (req, res) => {
  const id = req.session.userId;
  const user = userDatabase[id];
  if (user) {
    return res.redirect('/urls');
  }
  if (!user) {
    return res.redirect("/login");
  }
});

app.get("/urls", (req, res) => {
  const id = req.session.userId;
  const user = userDatabase[id];
  if (!user) {
    return res.status(403).send(`Status Code: 403 Unauthorized Access<br/>Please <a href="/login">log in</a> to view your shortened URLS`);
  }
  const userUrls = urlsForUser(user.id);
  const templateVars = { urls: userUrls, username: user };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const id = req.session.userId;
  const user = userDatabase[id];
  if (!user) {
    return res.redirect("/login");
  }
  res.render("urls_new", { username: user });
});

app.get("/urls/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  const id = req.session.userId;
  const user = userDatabase[id];

  if (!urlDatabase[shortURL]) {
    return res.status(404).send("Status Code: 404 Resource Not Found.");
  }
  if (!user) {
    return res.status(403).send(`Status Code: 403 Forbidden Access<br/>Please <a href="/login">log in</a> to view your shortened URLS`);
  }
  if (urlDatabase[shortURL].userID !== user.id) {
    return res.status(403).send(`Status Code: 403 Forbidden Access<br/> Request denied due to lacking credentials.`);
  }

  const templateVars = { shortURL, longURL: urlDatabase[shortURL].longURL, username: user };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  if (!urlDatabase[shortURL]) {
    return res.status(404).send("Status Code: 404 Resource Not Found.");
  }
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

app.get("/login", (req, res) => {
  const id = req.session.userId;
  const user = userDatabase[id];
  if (user) {
    return res.redirect('/urls');
  }
  const templateVars = { username: user };
  res.render("login", templateVars);
});

app.get("/register", (req, res) => {
  const id = req.session.userId;
  const user = userDatabase[id];
  if (user) {
    return res.redirect("/urls");
  }
  res.render("register", { username: user });
});

//POST Methods
app.post("/urls", (req, res) => {
  const id = req.session.userId;
  const user = userDatabase[id];
  if (!user) {
    return res.status(401).send("Status Code: 401 Unauthorized Request. Request has not been applied due to lack of authentication credentails.");
  }
  if (req.body.longURL === '') {
    return res.status(400).send("Status Code: 400 Bad Request. Cannot shorten empty link.");
  }
  const shortenedURL = generateRandomString();
  urlDatabase[shortenedURL] = { longURL: req.body.longURL, userID: user.id };
  res.redirect(`/urls/${shortenedURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const { shortURL } = req.params;
  const id = req.session.userId;
  const user = userDatabase[id];

  if (!urlDatabase[shortURL]) {
    return res.status(404).send("Status Code: 404 Resource Not Found.");
  }
  if (!user || urlDatabase[shortURL].userID !== user.id) {
    return res.status(403).send("Status Code: 403 Forbidden Access. Request denied due to lacking credentials");
  }

  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  const id = req.session.userId;
  const user = userDatabase[id];
  if (!urlDatabase[shortURL]) {
    return res.status(404).send("Status Code: 404 Resource Not Found.");
  }
  if (!user) {
    return res.status(403).send(`Status Code: 403 Forbidden Access. You must <a href="login">log in</a> to edit shortened links.`);
  }
  if (urlDatabase[shortURL].userID !== user.id) {
    return res.status(403).send(`Status Code: 403 Forbidden Access. You lack the credentials to access this resource.`);
  }

  const { newURL } = req.body;
  urlDatabase[shortURL].longURL = newURL;
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const { data, error, statusCode } = authUser(email, password);
  //rename data to user
  if (error) {
    return res.status(statusCode).send(error);
  }
  console.log(data.password);
  bcrypt.compare(password, data.password, (err, success) => {
    if (!success) {
      return res.status(400).send("Bad Request. Passwords do not match.");
    }
    req.session.userId = data.id;
    res.redirect('/urls');
  });
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  req.session = null;
  res.redirect('/urls');
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const { data, error, statusCode } = createUser(email, password);

  if (error) {
    return res.status(statusCode).send(error);
  }

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(data.password, salt, (err, hash) => {
      data.password = hash;
      userDatabase[data.id] = data;
      console.log(data.password);
      req.session.userId = data.id;
      res.redirect('/urls');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});