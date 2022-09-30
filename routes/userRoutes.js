const express = require('express');

const authController = require("../controllers/authController");

const router = express.Router();

//localhost:300
router.post("/signup", authController.signUp);
router.post("/login", authController.login);
// router
//   .route("/")
//   .get(authController.getAllPosts)
//   .post(authController.createPost)

// router
//   .route("/:id")
//   .get(authController.getOnePost)
//   .patch(authController.updatePost)
//   .delete(authController.deletePost)

module.exports = router;