const express = require("express");
const Author = require("../models/author");

const authorRouter = express.Router();

authorRouter
  .route("/")
  .get((req, res, next) => {
    Author.find()
      .sort({ name: 1 }) // Alphabetical order
      .then((authors) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(authors);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Author.create(req.body)
      .then((author) => {
        console.log("Author Created ", author);
        res.statusCode = 201;
        res.setHeader("Content-Type", "application/json");
        res.json(author);
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /authors");
  })
  .delete((req, res, next) => {
    Author.deleteMany()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

// Get featured authors
authorRouter
  .route("/featured")
  .get((req, res, next) => {
    Author.find({ featured: true })
      .sort({ name: 1 })
      .then((authors) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(authors);
      })
      .catch((err) => next(err));
  });

// Individual author routes
authorRouter
  .route("/:authorId")
  .get((req, res, next) => {
    Author.findById(req.params.authorId)
      .then((author) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(author);
      })
      .catch((err) => next(err));
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /authors/${req.params.authorId}`);
  })
  .put((req, res, next) => {
    Author.findByIdAndUpdate(
      req.params.authorId,
      { $set: req.body },
      { new: true }
    )
      .then((author) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(author);
      })
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Author.findByIdAndDelete(req.params.authorId)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

module.exports = authorRouter;
