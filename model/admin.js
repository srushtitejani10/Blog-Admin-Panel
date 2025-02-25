const mongoose = require('mongoose');
const path = require('path')
const multer = require('multer')
const imagePath = '/uploads';

const adminSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    hobby:{
        type:Array,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
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

adminSchema.statics.uploadImgFile = multer({storage:storeImage}).single('image');
adminSchema.statics.imgPath = imagePath

const Admin = mongoose.model('Admin',adminSchema)
module.exports = Admin