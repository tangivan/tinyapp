<p align="center">
  <a href="https://github.com/tangivan/tinyapp">
    <img src="imgs/logo-ivan.png" alt="Logo" width="130" height="80">
  </a>

  <h3 align="center">TinyApp Project</h3>

  <p align="center">
   A web full-stack application for shortening links
  </p>
</p>

<details open="open">
  <summary>Table of Contents</summary>
  <ul>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#demo-screenshots">Demo Screenshots</a></li>
      </ul>
      <ul>
        <li><a href="#dependencies">Dependencies</a></li>
      </ul>
    </li>
    <li>
    <a href="#features">Features</a>
    </li>
    <li>
    <a href="#getting-started">Getting Started</a>
    </li>
  </ul>
</details>

# About The Project
TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly). This web application features user account creation, shortening of long links, saving links to your list, updating links, and link deletion. If you want a place to hold all your shortened links, then this app is just an `npm install` away!
<br/>

## Demo Screenshots
<p align="center">
<img alt="log-in page" src="./imgs/tinyapp-1.png" width="100%">
<img alt="register page" src="./imgs/tinyapp-2.png" width="100%">
<img alt="list of urls" src="./imgs/tinyapp-3.png" width="100%">
<img alt="shortened link creation" src="./imgs/tinyapp-4.png" width="100%">
<img alt="edit links" src="./imgs/tinyapp-5.png" width="100%">
</p>
<br />

### Dependencies
* [Node.js](https://nodejs.dev/)
* [Express](https://expressjs.com/)
* [bcrypt](https://www.npmjs.com/package/bcryptjs)
* [body-parser](https://www.npmjs.com/package/body-parser)
* [cookie-session](https://www.npmjs.com/package/cookie-session)
* [morgan](https://expressjs.com/en/resources/middleware/morgan.html)

# Features
* User Authentication
* Link Shortener 
* List Of Shortened Links
* Link Update
* Link Deletion

# Getting Started
- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.