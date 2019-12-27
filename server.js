const express = require("express");
const dotenv = require("dotenv");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const mongoose = require("mongoose");
const https = require("https");
const fs = require("fs");
const expressLayouts = require("express-ejs-layouts");

const app = express();

// Certificate Setup
const key = fs.readFileSync("./config/certkey/privateKey.key");
const cert = fs.readFileSync("./config/certkey/certificate.crt");

// Load env
dotenv.config({ path: "./config.env" });

// Load database connection
const db = require("./config/keys").mongoURI;

// Connect Port to mongo db online
mongoose
  .connect(db, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log(`Mongo Db is connected`))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Routes
app.use("/", require("./router/index"));
app.use("/users", require("./router/users"));
// app.use("/", require("./router/users"));

// Server Port
const PORT = process.env.PORT || 9000;
let Server;

if (process.env.NODE_ENV === "development") {
  Server = https.createServer({ key: key, cert: cert }, app);
} else {
  Server = app;
}

Server.listen(PORT, () => {
  console.log(`Server running at ${process.env.NODE_ENV} mode on port ${PORT}`);
});
