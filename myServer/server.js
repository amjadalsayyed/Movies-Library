"use strict";
const express = require("express");
const data = require("./Movie_Data/data.json");
const cors = require("cors");
const app = express();

const PORT = 5000;

app.use(cors());

app.get("/", getData);
app.get("/favorite", (req, res) => {
  res.send("Welcome to Favorite Page");
});
app.get("*", errorHandler404);

function getData(req, res) {
  const newData = new DataConstructor(
    data.title,
    data.poster_path,
    data.overview
  );

  res.json(newData);
}

function DataConstructor(title, poster_path, overview) {
  this.title = title;
  this.poster_path = poster_path;
  this.overview = overview;
}

function errorHandler404(req, res) {
  res.status(404).json({
    status: 404,
    responseText: "page not found error",
  });
}
function errorHandler500(req, res) {
  res.status(500).json({
    status: 500,
    responseText: "Sorry, something went wrong",
  });
}

app.listen(PORT, () => {
  console.log(`Running on PORT ${PORT}`);
});
// if (res.status(404)) {
//   res.send({
//     status: 404,
//     responseText: "page not found error",
//   });
// } else if (res.status(500)) {
//   res.send({
//     status: 500,
//     responseText: "Sorry, something went wrong",
//   });
// }
