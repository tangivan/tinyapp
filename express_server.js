const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 2002; // default port 8080

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());

const generateRandomString = () => {
  return Math.floor((1 + Math.random()) * 100000000).toString(36);
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const emailLookup = (email, password = null) => {
  for (const key in users) {
    if (users[key].email === email) {
      if (!password) return true;
      if (password) {
        return users[key].password === password;
      }
    }
  }
  return false;
};

const getId = (email) => {
  for (const key in users) {
    if (users[key].email === email) {
      return users[key].id;
    }
  }
};

app.get("/", (req, res) => {
  res.redirect('/urls');
});

app.get("/urls", (req, res) => {
  const user = users[req.cookies["user_id"]];
  console.log(user);
  const templateVars = { urls: urlDatabase, username: user };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const shortenedURL = generateRandomString();
  urlDatabase[shortenedURL] = req.body.longURL;
  const user = users[req.cookies["user_id"]];
  const templateVars = { shortURL: shortenedURL, longURL: req.body.longURL, username: user };
  res.render("urls_show", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = users[req.cookies["user_id"]];
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
  const user = users[req.cookies["user_id"]];
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
  const user = users[req.cookies["user_id"]];
  const templateVars = { username: user };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email === '' || password === '') {
    return res.status(400).send("Error: 400 Status Code<br/>Email or Password is empty.");
  }
  if (!emailLookup(email)) {
    return res.status(403).send("Error: 403 Status Code<br/>Email cannot be found.");
  }
  if (!emailLookup(email, password)) {
    return res.status(403).send("Error: 403 Status Code<br/>Password incorrect.");
  }
  res.cookie("user_id", getId(email));
  res.redirect('/urls');
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect('/urls');
});

app.get("/register", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = { username: user };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (email === '' || password === '') {
    return res.status(400).send("Error: 400 Status Code<br/>Email or Password is empty");
  }
  if (emailLookup(email)) {
    return res.status(400).send("Error: 400 Status Code<br/>User already exists");
  }

  const id = generateRandomString();
  const newUser = {
    id,
    email,
    password
  };

  users[id] = newUser;

  console.log(users);
  res.cookie("user_id", id);
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});