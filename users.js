const mongoose=require('mongoose')
const plm=require('passport-local-mongoose')

 const userSchema=mongoose.Schema({
  username:String,
  fullname:String,
  email:String,
  password:String,
  profileImage:String,
  contact:Number,
  boards:{
    type:Array,
    default:[]
  },
  posts:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"post"
    }
  ]
})
 userSchema.plugin(plm)
const userModel=mongoose.model('user',userSchema)
module.exports=userModel