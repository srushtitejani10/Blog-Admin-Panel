const blog = require('../model/blog');
const category = require('../model/category');
const fs = require('fs')
const path = require('path')

module.exports.addBlog = async (req, res) => {
    try {
        const categories = await category.find();
        return res.render('addBlog', {
            categories
        })
    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}

module.exports.insertBlogRecords = async (req, res) => {
    try {
        let blogImage = '';
        console.log(req.file)
        if (req.file) {
            blogImage = await blog.imgPath + '/' + req.file.filename
            console.log(blogImage);

        }
        req.body.image = blogImage;
        const blogData = await blog.create(req.body)
        console.log(blogData);
        
        if (blogData) {
            let findByCategory = await category.findById(req.body.categoryId)
            findByCategory.blogId.push(blogData._id)
            await category.findByIdAndUpdate(req.body.categoryId,findByCategory)
        } else {
            console.log("asg");
            return res.redirect('back')
        }


        
        return res.redirect('back')

    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}

module.exports.viewBlog = async (req, res) => {
    try {

        let search = '';
        let perPage = 3;
        let page = 0;

        if (req.query.search) {
            search = req.query.search
        }


        if (req.query.page) {
            page = req.query.page
        }


        const sortValue = parseInt(req.query.sortValue) || 1

        const blogData = await blog.find({
            $or: [
                { title: { $regex: search, $options: 'i' } }
            ]
        }).skip(perPage * page).limit(perPage).sort({ title: sortValue }).populate("categoryId").exec();



        const totalBlogRecords = await blog.find({
            $or: [
                { title: { $regex: search, $options: 'i' } }
            ]
        }).countDocuments();


        const totalBlogsPages = Math.ceil(totalBlogRecords / perPage)


        if (blogData) {
            return res.render('viewBlog', {
                blogData,
                search,
                page: parseInt(page),
                totalBlogsPages
            })
        }
    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}

module.exports.deleteBlog = async (req, res) => {
    let id = req.params.id;
    try {
        let deleteBlogData = await blog.findById(id);
        if (deleteBlogData) {
            let deleteImg = path.join(__dirname, '..', deleteBlogData.image);
            await fs.unlinkSync(deleteImg)
        }
        await blog.findByIdAndDelete(deleteBlogData)
        req.flash('success',"delete blog successfully...")
        return res.redirect('back')
    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}

module.exports.editBlog = async (req, res) => {
    try {
        let id = req.params.id;
        const updateData = await blog.find().populate("categoryId").exec();
        const categories = await category.find();

        let editBlog = await blog.findById(id)
        if (editBlog) {
            return res.render('updateBlog', {
                editBlog,
                updateData,
                categories
            })
        }
    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}

module.exports.updateblog = async (req, res) => {
    try {
        let id = req.body.id;
        if (req.file) {
            let editBlog = await blog.findById(id)
            if (editBlog) {
                let oldImgPath = path.join(__dirname, '..', editBlog.image)
                fs.unlinkSync(oldImgPath)
            }
            else {
                req.flash('error',"Image not found..")
                
                return res.redirect('back')
            }
            req.body.image = blog.imgPath + '/' + req.file.filename;
            await blog.findByIdAndUpdate(id, req.body);
            req.flash('success',"blog updated successfully..")
            return res.redirect('/category/blog/viewBlog')
        }
        else {
            const updateBlog = await blog.findById(id)
            req.body.image = updateBlog.image;
            await blog.findByIdAndUpdate(id, req.body)
            req.flash('success',"Blog Updated successfullly...")
            return res.redirect('/category/blog/viewBlog')
        }
    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}

module.exports.multipleBlogsDelete = async (req, res) => {
    try {
        console.log(req.body);
        const blogDelete = await blog.deleteMany({ _id: { $in: req.body.Ids } })
        if (blogDelete) {
            req.flash('success',"blog updated successfully..")
            return res.redirect('back')
        } else {
            req.flash('success',"something wrong")
            return res.redirect('back')
        }

    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}
module.exports.changeBlogStatus = async (req, res) => {
    try {
        const blogStatusUpdate = await blog.findByIdAndUpdate(req.query.blogId, { status: req.query.status })
        if (blogStatusUpdate) {
            req.flash('success',"change blog status successfully..")

            return res.redirect('back')
        } else {
            req.flash('error',"Something Wrong")
            return res.redirect('back')
        }
    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}