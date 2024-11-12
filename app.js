//imports

const express =require('express');
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const session=require('express-session');
const app=express();
const path=require('path');
const cookieParser=require('cookie-parser')

//middleware set up
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
app.use(session({
  secret:'secret-key',
  resave:false,
  saveUninitialized:true
}))



//db connection
mongoose.connect('mongodb://localhost:27017/week')
.then(()=>console.log('db connected'))
.catch((err)=>console.log('db connection error',err))


//seting templates enginee and static files

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')))

//routes
const authroute=require('./routes/auth');

app.use('/auth',authroute);


//start server

app.listen(3000,()=>{
  console.log('server sratred')
})