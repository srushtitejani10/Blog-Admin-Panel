const category = require('../model/category')
const blog = require('../model/blog');
const Comment = require('../model/CommentModel');
const { model } = require('mongoose');



module.exports.home = async (req, res) => {
    try {

        let search = '';
        let page = 0;
        let perPage = 3;


        let sortValue = parseInt(req.query.sortValue) || 1

        if (req.query.search) {
            search = req.query.search
        }

        if(req.query.page){
            page = req.query.page
        }

        const allBlog = await blog.find({
            status: true,
            $or: [
                { title: { $regex: search, $options: 'i' } }
            ]
        }).skip(perPage*page).limit(perPage).sort({ title: sortValue })
        
        
        const totalBlog = await blog.find({
            $or: [
                { title: { $regex: search, $options: 'i' } }
            ]
            
        }).countDocuments()
        let totallyBlog;
        if(req.query.catId){
            totallyBlog = await blog.find({status:true,categoryId:req.query.catId}) 
        }
        else{
            totallyBlog = await blog.find({status:true}) 
        }
        let totalPages = Math.ceil(totalBlog/perPage)
        let categoryData = await category.find();
        return res.render('userPanel/home', {
            allBlog,
            totallyBlog,
            categoryData,       
            search,
            page:parseInt(page),
            totalPages
        })
    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}

module.exports.singleBlog = async (req, res) => {
    try {
        postId = req.params.id
        let Commentsdata = await Comment.find({status:true,postId})
        console.log(Commentsdata);
        const singleBlog = await blog.findById(postId)
        return res.render('userPanel/singleBlog', {
            singleBlog,
            Commentsdata
        })
    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}

module.exports.addComment = async(req,res)=>{
    try{
        var Image = '';
        if(req.file){
            Image = Comment.imgPath+'/'+req.file.filename;
        }
        req.body.Image = Image;
        req.body.status = true
        console.log("hihihihihi ",req.body);
        console.log("hihihihihi ",req.file);

        let addCom = await Comment.create(req.body);
        if(addCom){
            let blogDetails = await blog.findById(req.body.postId);
            blogDetails.CommentId.push(addCom._id);
            await blog.findByIdAndUpdate(req.body.postId,blogDetails)
        }
        return res.redirect('back')
        
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}
