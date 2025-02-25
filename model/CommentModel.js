const mongoose = require('mongoose');
const path = require('path')
const multer = require('multer')
const imagePath = '/uploads';

const CommentSchema = mongoose.Schema({
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'blog',
        required:true
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    Comment:{
        type: String,
        required: true
    },
    Image:{
        type:String,
        require:true
    },
    status:{
        type:Boolean,
        default:true
    }
},{
    timestamps : true,
})

const storeImage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,path.join(__dirname,'..',imagePath))
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+'-'+Date.now())
    }
})

CommentSchema.statics.uploadImgFile = multer({storage:storeImage}).single('Image');
CommentSchema.statics.imgPath = imagePath

const Comment = mongoose.model('Comment',CommentSchema)
module.exports = Comment;