var express = require('express');
var router = express.Router();
const connection=require('./connection')
const userModel=require('./users')
const postModel=require('./post')
const passport=require('passport')
const localStrategy=require('passport-local')
const upload=require('./multer')

passport.use(new localStrategy(userModel.authenticate()))

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('homepage')
});

router.get('/registration',(req,res)=>{
  res.render('registration')
})

router.post('/registration',(req,res,next)=>{
  const data=new userModel({
   username:req.body.username,
   email:req.body.email,
   contact:req.body.contact
  })
  userModel.register(data,req.body.password)
  .then(function(){
    passport.authenticate('local')(req,res,function(){
      res.redirect('/profile')
    })
  })
})

router.get('/login',(req,res)=>{
  res.render('login',{error:req.flash('error')})
})

router.post('/login',passport.authenticate('local',{
  failureRedirect:'/login',
  successRedirect:"/profile",
  failureFlash:true
}), function(req,res,next){
})

router.get('/logout',(req,res,next)=>{
  req.logOut(function(err){
    if(err){
      return next(err)
    }
        res.redirect('/')
      }
  )}
)

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect('/')
}



router.get('/profile',isLoggedIn ,async(req,res,next)=>{
  const user=await userModel.findOne({
    username:req.session.passport.user
  }) 
  .populate("posts")
  res.render('profile',{user})
})

router.get('/show/posts',isLoggedIn ,async(req,res,next)=>{
  const user=await userModel.findOne({
    username:req.session.passport.user
  }) 
  .populate("posts")
  res.render('show',{user})
})


router.post('/fileupload',isLoggedIn,upload.single('image'),async function(req,res,next){
  const user=await userModel.findOne({
    username:req.session.passport.user
  })
  user.profileImage=req.file.filename
  await user.save()
  res.redirect('/profile')

})
router.get('/feed',isLoggedIn,async(req,res)=>{
  const user=await userModel.findOne({
    username:req.session.passport.user
  })
 const posts= await postModel.find()
  .populate("user")

  res.render("feed",{user,posts})

})
router.get('/add',isLoggedIn ,async(req,res,next)=>{
  const user=await userModel.findOne({
    username:req.session.passport.user
  })
  res.render('add',{user})
})

router.post('/createpost',isLoggedIn ,upload.single("postimage"),async(req,res,next)=>{
  const user=await userModel.findOne({
    username:req.session.passport.user
  })
 const post= await postModel.create({
    user:user._id,
    title:req.body.title,
    description:req.body.description,
    image:req.file.filename
  })
  user.posts.push(post._id)
  await user.save()
  res.redirect('./profile')
})
connection()
module.exports = router;
