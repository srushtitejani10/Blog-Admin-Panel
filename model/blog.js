const mongoose = require('mongoose');
const path = require('path')
const multer = require('multer')
const imagePath = '/uploads/blogImage';

const blogSchema = mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    CommentId: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }]
}, {
    timestamps: true,
})

const storeBlogImage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', imagePath))
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

blogSchema.statics.uploadBlogImgFile = multer({ storage: storeBlogImage }).single('image');
blogSchema.statics.imgPath = imagePath

const blog = mongoose.model('blog', blogSchema)
module.exports = blog