const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const generateRandomString = require("./helpers/generateRandomString");
const userHelperGenerator = require("./helpers/userHelpers");

const userDatabase = require("./data/userData");
const urlDatabase = require("./data/urlData");
const { authUser, createUser, urlsForUser } = userHelperGenerator(userDatabase, urlDatabase);

const app = express();
const PORT = 2002; // default port 8080

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.redirect('/urls');
});

app.get("/urls", (req, res) => {
  const user = userDatabase[req.cookies["user_id"]];
  if (!user) {
    res.status(403);
    return res.render("unauthenticated", { username: user, error: `Please log in to view your shortened URLs` });
  }
  const userUrls = urlsForUser(user.id);
  const templateVars = { urls: userUrls, username: user };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const user = userDatabase[req.cookies["user_id"]];
  if (!user) {
    return res.status(401).send("Status Code: 401 Unauthorized Request. Request has not been applied due to lack of authentication credentails.");
  }
  if (req.body.longURL === '') {
    return res.status(400).send("Status Code: 400 Bad Request. Cannot shorten empty link.");
  }
  const shortenedURL = generateRandomString();
  urlDatabase[shortenedURL] = { longURL: req.body.longURL, userID: user.id };
  const templateVars = { shortURL: shortenedURL, longURL: req.body.longURL, username: user };
  res.render("urls_show", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = userDatabase[req.cookies["user_id"]];
  if (!user) {
    return res.redirect("/login");
  }
  const templateVars = { username: user };
  res.render("urls_new", templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const { shortURL } = req.params;
  const user = userDatabase[req.cookies["user_id"]];

  if (!urlDatabase[shortURL]) {
    return res.status(404).send("Status Code: 404 Resource Not Found.");
  }
  if (!user || urlDatabase[shortURL].userID !== user.id) {
    return res.status(403).send("Status Code: 403 Forbidden Access.");
  }

  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.get("/urls/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  const user = userDatabase[req.cookies["user_id"]];

  if (!urlDatabase[shortURL]) {
    return res.status(404).send("Status Code: 404 Resource Not Found.");
  }
  if (!user) {
    return res.render("unauthenticated", { username: null, error: "Status Code: 403 Forbidden Access. You must Log in." });
  }
  if (urlDatabase[shortURL].userID !== user.id) {
    res.status(403);
    return res.render("unauthenticated", { username: user, error: "Status Code: 403 Forbidden Access" });
  }

  const templateVars = { shortURL, longURL: urlDatabase[shortURL].longURL, username: user };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  const user = userDatabase[req.cookies["user_id"]];

  if (!urlDatabase[shortURL]) {
    return res.status(404).send("Status Code: 404 Resource Not Found.");
  }
  if (!user) {
    return res.render("unauthenticated", { username: null, error: "Status Code: 403 Forbidden Access. You must Log in." });
  }
  if (urlDatabase[shortURL].userID !== user.id) {
    res.status(403);
    return res.render("unauthenticated", { username: user, error: "Status Code: 403 Forbidden Access" });
  }

  const { newURL } = req.body;
  urlDatabase[shortURL].longURL = newURL;
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  if (!urlDatabase[shortURL]) {
    return res.status(404).send("Status Code: 404 Resource Not Found.");
  }
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.get("/login", (req, res) => {
  const user = userDatabase[req.cookies["user_id"]];
  if (user) {
    return res.redirect('/urls');
  }
  const templateVars = { username: user };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const { data, error, statusCode } = authUser(email, password);

  if (error) {
    return res.status(statusCode).send(error);
  }

  res.cookie("user_id", data.id);
  res.redirect('/urls');
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect('/urls');
});

app.get("/register", (req, res) => {
  const user = userDatabase[req.cookies["user_id"]];
  if (user) {
    return res.redirect("/urls");
  }
  const templateVars = { username: user };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const { data, error, statusCode } = createUser(email, password);

  if (error) {
    return res.status(statusCode).send(error);
  }
  userDatabase[data.id] = data;
  res.cookie("user_id", data.id);
  res.redirect('/urls');
});

app.get("*", (req, res) => {
  const user = userDatabase[req.cookies["user_id"]];
  if (user) {
    return res.redirect("/urls");
  } else {
    return res.redirect("/login");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});