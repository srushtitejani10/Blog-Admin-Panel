const { validationResult } = require('express-validator');
const category = require('../model/category')
module.exports.addCategory = async (req, res) => {
    try {
        return res.render('addCategory',{
            errorsData:[],
            old:[]
        })
    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}

module.exports.insertCategory = async (req, res) => {
    try {
        const errors = validationResult(req)
        console.log(errors.mapped());
        if(!errors.isEmpty()){
            return res.render('addCategory',{
                errorsData:errors.mapped(),
                old: req.body
            })
        }
        const categoryData = await category.create(req.body)
        req.flash('success',"Add Category Successfully...")
        return res.redirect('back')
    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}

module.exports.viewCategory = async (req, res) => {
    try {

        let search = '';
        let perPage = 2;
        let page = 0;


        if (req.query.search) {
            search = req.query.search
        }


        if (req.query.page) {
            page = req.query.page
        }
        console.log(req.query);

        let sortValue = parseInt(req.query.sortValue) || 1;
        const categoryData = await category.find({
            $or: [
                { categoryName: { $regex: search,$options:'i' } }
            ]
        }).skip(perPage * page).limit(perPage).sort({ categoryName: sortValue })


        var totalsCategoryRecords = await category.find({
            $or: [
                { email: { $regex: search,$options:'i' } },
                { hobby: { $regex: search,$options:'i' } },
                { message: { $regex: search ,$options:'i'} }
            ]
        }).countDocuments();

        const totalCategoryPages = Math.ceil(totalsCategoryRecords / perPage)


        return res.render('viewCategory', {
            categoryData,
            search,
            page: parseInt(page),
            totalCategoryPages,

        })

    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}

module.exports.deleteCategory = async (req, res) => {
    try {
        const categoryData = await category.find();
        if (categoryData) {
            await category.findByIdAndDelete(req.params.id)
            req.flash('success',"Category Delete Successfully")
            return res.redirect('/category/viewCategory')
        } else {
            req.flas('error',"category Data not delete")
            return res.redirect('back')
        }
    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}

module.exports.editCategory = async (req, res) => {
    try {
        let id = req.params.id;
        let editCategory = await category.findById(id)
        if (editCategory) {
            return res.render('updateCategory', {
                editCategory
            })
        }
    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}

module.exports.updateCategory = async (req, res) => {
    try {
        let id = req.body.id
        let updateCategory = await category.findById(id)
        console.log(id);
        console.log(req.body);

        if (updateCategory) {
            await category.findByIdAndUpdate(id, req.body)
            req.flash('success',"update category Successfully")
            return res.redirect('/category/viewCategory')
        }
    } catch (error) {
        req.flash('error',"Something Wrong")
        return res.redirect('back')
    }
}


module.exports.multipleCategoriesDelete = async (req, res) => {
    try {
        console.log(req.body);
        let categoryDelete = await category.deleteMany({ _id: { $in: req.body.Ids } })
        if (categoryDelete) {
            req.flash('success',"Multiple Delete Successfully")
            return res.redirect('back')
        } else {
            req.flash('error'," not Multiple Delete")
            return res.redirect('back')
        }
    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}

module.exports.changeCategoryStatus = async (req, res) => {
    try {
        const categoryStatusUpdate = await category.findByIdAndUpdate(req.query.categoryId, { status: req.query.status })
        if (categoryStatusUpdate) {
            req.flash('success',"Change Status  Successfully")
            return res.redirect('back')
        } else {
            req.flash('error'," not Status Change")
            return res.redirect('back')
        }
    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}