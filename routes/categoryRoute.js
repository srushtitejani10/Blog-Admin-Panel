const express = require('express');
const routes = express.Router();
console.log("Router");

const category = require('../model/category')
const categoryCtl = require('../controller/categoryCtl')
const { check,validationResult } = require('express-validator');

routes.get('/', categoryCtl.addCategory)

routes.post('/insertCategory', [
    check('categoryName').notEmpty().withMessage('*category is required').isLength({ min: 2 }).withMessage('*Category must have at least two words'),
], categoryCtl.insertCategory)

routes.get('/viewCategory', categoryCtl.viewCategory)

routes.get('/deleteCategory/:id', categoryCtl.deleteCategory)

routes.get('/editCategory/:id', categoryCtl.editCategory)

routes.post('/updateCategory', categoryCtl.updateCategory)

routes.use('/blog', require('./blogRoute'))

routes.post('/multipleCategoriesDelete', categoryCtl.multipleCategoriesDelete)

routes.get('/changeCategoryStatus', categoryCtl.changeCategoryStatus)

module.exports = routes