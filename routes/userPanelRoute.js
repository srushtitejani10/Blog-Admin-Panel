const express = require('express');
const routes = express.Router();
const userPanelCtl = require('../controller/userPanelCtl')
const Comment = require('../model/CommentModel');

routes.get('/',userPanelCtl.home)

routes.get('/singleBlog/:id',userPanelCtl.singleBlog)

routes.post('/addComment',Comment.uploadImgFile,userPanelCtl.addComment);


module.exports = routes
