const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    title:String,
    description:String,
    image:String
})
    
const postModel = mongoose.model('post', postSchema)
module.exports = postModel