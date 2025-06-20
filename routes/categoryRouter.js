const express = require("express");
const Category = require("../models/category");

const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .get((req, res, next) => {
    Category.find()
      .sort({ name: 1 }) // Alphabetical order
      .then((categories) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(categories);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    // Generate slug from name if not provided
    if (!req.body.slug && req.body.name) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    
    Category.create(req.body)
      .then((category) => {
        console.log("Category Created ", category);
        res.statusCode = 201;
        res.setHeader("Content-Type", "application/json");
        res.json(category);
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /categories");
  })
  .delete((req, res, next) => {
    Category.deleteMany()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

// Get featured categories
categoryRouter
  .route("/featured")
  .get((req, res, next) => {
    Category.find({ featured: true })
      .sort({ name: 1 })
      .then((categories) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(categories);
      })
      .catch((err) => next(err));
  });

// Individual category routes
categoryRouter
  .route("/:categoryId")
  .get((req, res, next) => {
    Category.findById(req.params.categoryId)
      .then((category) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(category);
      })
      .catch((err) => next(err));
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /categories/${req.params.categoryId}`);
  })
  .put((req, res, next) => {
    Category.findByIdAndUpdate(
      req.params.categoryId,
      { $set: req.body },
      { new: true }
    )
      .then((category) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(category);
      })
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Category.findByIdAndDelete(req.params.categoryId)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

module.exports = categoryRouter;
