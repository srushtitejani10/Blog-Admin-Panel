const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    categoryName:{
        type:String,
        required:true
    },
    blogId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'blog'
    }],
    status:{
        type:Boolean,
        default:true
    }
},{
    timestamps : true,
})

const category = mongoose.model('category',categorySchema)
module.exports = category