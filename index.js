const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");

const urlModel = require("./models/url");

app.use(
  session({
    cookie: { maxAge: 60000 },
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });

app.use(flash());

app.use(function(req, res, next) {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", function(req, res) {
  res.render("home");
});

app.post("/create", function(req, res) {
  urlModel.findById(req.body.id, function(err, url) {
    if (!url) {
      const newUrl = new urlModel({
        _id: req.body.id,
        url: req.body.url
      });
      newUrl.save();
      req.flash("success", req.body.id);
    } else if (err) {
      req.flash("error", "Something went wrong");
    } else {
      req.flash("error", "Shortened ID already taken");
    }
    res.redirect("/");
  });
});

app.get("/:id", function(req, res) {
  urlModel.findById(req.params.id, function(err, url) {
    if (err) {
      console.log(err);
      req.flash("error", err.message);
      res.redirect("/");
    } else if (url) {
      res.redirect(url.url);
    } else {
      req.flash("error", "No Shortened URL found for " + req.params.id);
      res.redirect("/");
    }
  });
});

app.listen(process.env.PORT || 8080);
