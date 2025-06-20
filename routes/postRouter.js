const express = require("express");
const Post = require("../models/post");

const postRouter = express.Router();

postRouter
  .route("/")
  .get((req, res, next) => {
    let query = {};

    // Filter by published status
    if (req.query.published !== undefined) {
      query.published = req.query.published === "true";
    }

    // Filter by category
    if (req.query.category) {
      query.categories = { $in: [req.query.category] };
    }

    // Filter by tag
    if (req.query.tag) {
      query.tags = { $in: [req.query.tag] };
    }

    // Filter by author
    if (req.query.author) {
      query.author = req.query.author;
    }

    Post.find(query)
      .sort({ createdAt: -1 }) // Latest first
      .then((posts) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(posts);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    // Generate slug from title if not provided
    if (!req.body.slug && req.body.title) {
      req.body.slug = req.body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    Post.create(req.body)
      .then((post) => {
        console.log("Post Created ", post);
        res.statusCode = 201;
        res.setHeader("Content-Type", "application/json");
        res.json(post);
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /posts");
  })
  .delete((req, res, next) => {
    Post.deleteMany()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

postRouter.route("/featured").get((req, res, next) => {
  Post.find({ featured: true, published: true })
    .sort({ createdAt: -1 })
    .then((posts) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(posts);
    })
    .catch((err) => next(err));
});

postRouter
  .route("/:postId")
  .get((req, res, next) => {
    Post.findById(req.params.postId)
      .then((post) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(post);
      })
      .catch((err) => next(err));
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /posts/${req.params.postId}`);
  })
  .put((req, res, next) => {
    Post.findByIdAndUpdate(req.params.postId, { $set: req.body }, { new: true })
      .then((post) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(post);
      })
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Post.findByIdAndDelete(req.params.postId)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

postRouter
  .route("/:postId/comments")
  .get((req, res, next) => {
    Post.findById(req.params.postId)
      .then((post) => {
        if (post) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(post.comments);
        } else {
          err = new Error(`Post ${req.params.postId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Post.findById(req.params.postId)
      .then((post) => {
        if (post) {
          post.comments.push(req.body);
          post
            .save()
            .then((post) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(post);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(`Post ${req.params.postId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });

module.exports = postRouter;
