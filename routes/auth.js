const express=require('express');
const bcrypt=require('bcryptjs');
const User=require('../models/User');
const router=express.Router();

//render signup page

router.get('/signup',(req,res)=>{
  res.render('signup')
});

//handle signup page

router.post('/signup',async(req,res)=>{
  const{name,email,password}=req.body;
  const user =new User ({name,email,password});
  await user.save();
  res.redirect('/auth/login');
});

//render login page

router.get('/login',(req,res)=>{
  res.render('login');
})

//handle login page

router.post('/login',async(req,res)=>{
  const {email,password}=req.body
  const user=await User.findOne({email});
  if(user && await bcrypt.compare(password,user.password)){
    req.session.userId =user._id;
    req.session.role=user.role;
    res.redirect('/home');
  }
  else{
    res.render('login',{error:'invalid credentials'})
  }
})

//homepage
router.get('/home',(req,res)=>{
  if(req.session.userId){
    res.render('home')
  }
  else{
    res.redirect('/auth/login');
  }
});
router.get('logout',(req,res)=>{
  req.session.destroy(err=>{
    if(err) return res.status(500).send('error logging out')
      res.redirect('/auth/login')
  })
})

module.exports=router;