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

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user._id;
    req.session.role = user.role;
    console.log("Session userId set:", req.session.userId);
    res.redirect('/auth/home');
  } else {
    res.render('login', { error: 'invalid credentials' });
  }
});

//homepage
router.get('/home', async (req, res) => {
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      if (user) {
        res.render('home', { userName: user.name });  // Pass the user's name to the template
      } else {
        res.redirect('/auth/login');
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      res.redirect('/auth/login');
    }
  } else {
    res.redirect('/auth/login');
  }
});;
router.get('/logout',(req,res)=>{
  req.session.destroy(err=>{
    if(err) return res.status(500).send('error in logging out')
      res.redirect('/auth/login')
  })
})

module.exports=router;