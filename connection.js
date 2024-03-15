const mongoose=require('mongoose')

const connection=async()=>{
    const mongo_connect=await mongoose.connect('mongodb://localhost:27017/newproject')
.then(()=>{
    console.log("connected..!")
})
.catch((err)=>{
    console.log("not connected..! The error is : ",err)
})
}

module.exports=connection