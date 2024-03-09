if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

const express = require('express');
const path = require('path');
const fs= require('fs');
// const data = require('./data.json');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodoverride = require('method-override');
const initializePassport = require('./passport-config');
const mongoose = require('mongoose');
const collection = require('./schema');


const app = express();
const dataFilePath = './data.json';
app.use(express.json());

const da= fs.readFileSync(dataFilePath,'utf-8');
const data= JSON.parse(da);
// console.log(data)


initializePassport(passport);

app.use(express.static(path.join(__dirname+'/public')));
// Define the path to your data file

app.set('view-engine','ejs');
app.use(express.urlencoded({extended:false}));
app.use(flash());
app.use(session({
  secret:process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(methodoverride('_method'));

app.use(passport.initialize())
app.use(passport.session())

app.get('/home',checkAuthenticated,(req,res)=>{
  res.render('home.ejs');
});

app.get('/login',checkNotAuthenticated,(req,res)=>{
  res.render('login.ejs');
  // console.log("Login Page Rendered");
});

app.post('/login',checkNotAuthenticated,passport.authenticate('local',{
  successRedirect:'/home',
  failureRedirect:'/login',
  failureFlash:true
})

);

app.get('/register',checkNotAuthenticated,(req,res)=>{
  res.render('register.ejs');
  // console.log("Register page Rendered..");
});



app.post('/register',checkNotAuthenticated,async(req,res)=>{
    try{
      const hashedPass = await bcrypt.hash(req.body.password,10);
      const d =({
        id:Date.now().toString(),
        username : req.body.username,
        email:req.body.email,
        password : hashedPass
      });
      // data.push(d);
      
      const existsuser = await collection.findOne({email:d.email});

      if(existsuser){
        res.send(`<center><h2>User Already Exists...!</h2><br><h3>Please Try again with different Email Id..</h3></center>`);
      }
      else{
      const userdata = await collection.insertMany(d);
      console.log(userdata);
      res.redirect('/login');
      // fs.writeFileSync(dataFilePath,JSON.stringify(data));
      }
    }
    catch(error){
      console.log(error);
    }
    // console.log(data);
});


app.delete('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/login');
  });
});


app.use("*",(req,res)=>{
  
  res.send(`<br><center><h2>Page You are Looking For Not Found....</h2><h3>Try Again...!</h3></center>`);
  
});



function checkAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    // console.log("....")
    // window.alert("Logged In successfully..")
    return next()
  }
  // console.log("User Not Authenticated..")
  // window.alert("Not a Authenticated User..");
  res.redirect('/login')
}

function checkNotAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    // console.log("From Authentication...");
    return res.redirect('/home');

  }
  // console.log("From Authentication...else");
  next()
}
const port = process.env.Port
mongoose
  .connect(process.env.MONGO_URI)
  .then(()=>{
    console.log("Connected to DB...");
    app.listen(port, () => {
    console.log('Server running on Port : '+port);
    });
  })
  .catch((err)=>{console.error(err)});
















// function readData(){
//     try {
//         const data = fs.readFileSync(dataFilePath, 'utf-8');
//         return JSON.parse(data);
//         // console.log("File contents:",parsedData);
//       //   console.log(parsedData.name); 
//       //   for (const item of parsedData) {
//       //     console.log(item.name); 
//       //   }
//       }
//     catch (err) {
//         console.error('Error reading or parsing data file:', err);
//     }
  
// }









// app.get('/adddetails', (req, res) => {
  //         // Check if the file exists before sending
  //         if (fs.existsSync(path.join(__dirname, 'public', 'register.html'))) {
    //           res.sendFile(path.join(__dirname, 'public', 'register.html'));
    //         } else {
      //           res.status(404).send('`register.html` file not found.');
      //         }
      // });
      
      
      // app.get('/getdetails', (req, res) => {
        //     try{
      //         const data = readData();
      //         res.json(data);
      //         console.log('Data retrieved successfully from the file.');
      //     }
      //     catch(err){
        //         console.log(err);
      //         res.status(500).send('An error occurred while retrieving data.');
      //     }   
      // });