const express = require("express");
const path = require("path");
const hbs = require("hbs");

const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();

// define path for Express config
const publicDirectorypath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const commonPath = path.join(__dirname, "../templates/common");

// setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(commonPath);

// setup static dir to server
app.use(express.static(publicDirectorypath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "yashvant",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About page",
    name: "Yashvant Yadav",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help page",
    name: "Yashvant Yadav",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({ error: "Please provide address" });
  }
  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send(error);
      }
      forecast(latitude, longitude, (error, forecastdata) => {
        if (error) {
          return res.send(error);
        }
        res.send({
          location,
          Forecast: forecastdata,
          Address: req.query.address,
        });
      });
    }
  );
});
app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    errorMessage: "Help article not found",
    name: "Yashvant Yadav",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    errorMessage: "You are loking that page not found",
    name: "Yashvant Yadav",
  });
});

// app listen

app.listen(3000, () => {
  console.log("App is running on port 3000");
});
