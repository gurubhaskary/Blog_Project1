const express = require('express');
const router = express.Router();
let authorController = require("../controllers/authorController")
let blogController = require("../controllers/blogController")
let middleWare = require("../MiddleWare/MiddleWare")

router.post("/authors", authorController.createAuthor)
router.post("/login", authorController.loginUser)
router.post("/blogs", middleWare.authenticate, blogController.createBlog)
router.get("/blogs", middleWare.authenticate, blogController.getBlogs)
router.put("/blogs/:blogId", middleWare.authenticate, middleWare.authorise, blogController.updateBlogs)
router.delete("/blogs/:blogId", middleWare.authenticate, middleWare.authorise, blogController.delBlogByParams)
router.delete("/blogs", middleWare.authenticate, middleWare.authorise2, blogController.delBlogByQuery)



module.exports = router;