const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const generateRandomString = require("./helpers/generateRandomString");
const userHelperGenerator = require("./helpers/userHelpers");

const userDatabase = require("./data/userData");
const urlDatabase = require("./data/urlData");
const { authUser, createUser } = userHelperGenerator(userDatabase);

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
  console.log(user);
  const templateVars = { urls: urlDatabase, username: user };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const shortenedURL = generateRandomString();
  urlDatabase[shortenedURL] = req.body.longURL;
  const user = userDatabase[req.cookies["user_id"]];
  const templateVars = { shortURL: shortenedURL, longURL: req.body.longURL, username: user };
  res.render("urls_show", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = userDatabase[req.cookies["user_id"]];
  const templateVars = { username: user };
  res.render("urls_new", templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const { shortURL } = req.params;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.get("/urls/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  const user = userDatabase[req.cookies["user_id"]];
  const templateVars = { shortURL, longURL: urlDatabase[shortURL], username: user };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  const { newURL } = req.body;
  urlDatabase[shortURL] = newURL;
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/login", (req, res) => {
  const user = userDatabase[req.cookies["user_id"]];
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
  const templateVars = { username: user };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  console.log(userDatabase);
  const { email, password } = req.body;
  const { data, error, statusCode } = createUser(email, password);

  if (error) {
    return res.status(statusCode).send(error);
  }
  userDatabase[data.id] = data;
  res.cookie("user_id", data.id);
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});