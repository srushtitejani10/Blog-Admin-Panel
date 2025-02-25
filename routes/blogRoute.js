const express = require('express')
const routes = express.Router()
const blog = require('../model/blog')
const blogCtl = require('../controller/blogCtl');



routes.get('/',blogCtl.addBlog)

routes.post('/insertBlogRecords',blog.uploadBlogImgFile,blogCtl.insertBlogRecords)

routes.get('/viewBlog',blogCtl.viewBlog)

routes.get('/deleteBlog/:id',blogCtl.deleteBlog)

routes.get('/editBlog/:id',blogCtl.editBlog)

routes.post('/updateblog',blogCtl.updateblog)

routes.post('/multipleBlogsDelete',blogCtl.multipleBlogsDelete)

routes.get('/changeBlogStatus',blogCtl.changeBlogStatus)

module.exports = routes
