"use strict";
const express = require("express");
const data = require("./Movie_Data/data.json");
const cors = require("cors");
const axios = require("axios");
const pg = require("pg");
require("dotenv").config();
const app = express();
const PORT = 5000;
const client = new pg.Client(process.env.DATABASE_URL);

app.use(cors());
app.use(express.json());

app.get("/", getData);
app.get("/favorite", (req, res) => res.send("Hello from favorite"));
app.get("/trending", getTrending);
app.get("/search", getSearch);
app.get("/genre", getGenre);
app.get("/getMovie", getMovie);
app.post("/getMovie", addMovie);
app.get("/person", getPerson);
app.get("*", errorHandler404);
app.use(errorHandler);

function getData(req, res) {
  const newData = new DataConstructor(
    data.title,
    data.poster_path,
    data.overview
  );

  res.json(newData);
}

function errorHandler(error, req, res) {
  res.status(500).send({
    status: 500,
    message: error,
  });
}

function errorHandler404(req, res) {
  res.status(404).json({
    status: 404,
    responseText: "page not found error",
  });
}

client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Running on PORT ${PORT}`);
  });
});

// ************************************************************trending func*********************************************************

const trendingURL = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.API_KEY}&language=en-US`;

function getTrending(req, res) {
  try {
    const movies = axios
      .get(trendingURL)
      .then((response) => {
        const newMoveis = response.data.results.map(
          (e) =>
            (e = new Movie_Data(
              e.id,
              e.title,
              e.release_date,
              e.poster_path,
              e.overview,
              e.name
            ))
        );

        res.json(newMoveis);
      })
      .catch((e) => console.log(e.message));
  } catch (error) {
    errorHandler(error, req, res);
  }
}

// ************************************************************search func*********************************************************

const searchURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=en-US&query=The%20Hateful%20Eight&page=1`;

function getSearch(req, res) {
  try {
    axios
      .get(searchURL)
      .then((response) => {
        const newMoveis = response.data.results.map(
          (e) =>
            (e = new Movie_Data(
              e.id,
              e.title,
              e.release_date,
              e.poster_path,
              e.overview,
              e.name
            ))
        );

        res.json(newMoveis);
      })
      .catch((e) => console.log(e.message));
  } catch (error) {
    errorHandler(error, req, res);
  }
}

// ************************************************************genre func*********************************************************

const genreURL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.API_KEY}&language=en`;

function getGenre(req, res) {
  try {
    axios
      .get(genreURL)
      .then((response) => {
        res.json(response.data);
      })
      .catch((e) => console.log(e.message));
  } catch (error) {
    errorHandler(error, req, res);
  }
}

// ************************************************************person func*********************************************************

const personURL = `https://api.themoviedb.org/3/person/10859?api_key=${process.env.API_KEY}&language=en`;

function getPerson(req, res) {
  try {
    axios
      .get(personURL)
      .then((response) => {
        res.json(
          new Person(
            response.data.id,
            response.data.name,
            response.data.birthday,
            response.data.biography
          )
        );
      })
      .catch((e) => console.log(e.message));
  } catch (error) {
    errorHandler(error, req, res);
  }
}
// *****************************************************addMovie****************************************************

function addMovie(req, res) {
  const movie = req.body;
  const sqlQuery = `INSERT INTO movies (title, release_date, overview,poster_path) VALUES ('${movie.title}','${movie.release_date}','${movie.overview}','${movie.poster_path}')`;
  client
    .query(sqlQuery)
    .then((data) => {
      res.send("added successfully");
    })
    .catch((err) => console.log(err.message));
}

// *****************************************************getmovie****************************************************
function getMovie(req, res) {
  const sql = `SELECT * FROM movies;`;
  client
    .query(sql)
    .then((data) => {
      res.send(data.rows);
    })
    .catch((err) => {
      errorHandler(err, req, res);
    });
}

// *****************************************************constructor*************************************************

function DataConstructor(title, poster_path, overview) {
  this.title = title;
  this.poster_path = poster_path;
  this.overview = overview;
}

function Person(id, name, birthday, biography) {
  this.id = id;
  this.name = name;
  this.birthday = birthday;
  this.biography = biography;
}

function Movie_Data(id, title, release_date, poster_path, overview, name) {
  this.id = id;
  this.title = title || name;
  this.release_date = release_date;
  this.poster_path = poster_path;
  this.overview = overview;
}
