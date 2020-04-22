require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const helmet = require('helmet');
const newrouter = require('./routes/user');
const {User} = require('./model/users');
const cookieparser = require('cookie-parser');
const csurf = require('csurf');


const app = express();
 

let v = " ";
let n = " ";

app.use(helmet());

app.use(helmet.hidePoweredBy({setTo: 'PHP 7.0 '}));

app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"]
    }
  }));


app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname,"/")));

app.use(bodyparser.urlencoded({extended: true}));

app.use(express.json());




app.use(cookieparser());

app.use(csurf({
     cookie:{
       path:'/',
       httpOnly:true,
       secure:true,
       sameSite:true,
       maxAge:15*60*1000
     }
   
}));

  // Make the token available to all views
  app.use(function (req, res, next){
      res.locals.csrfToken = req.csrfToken();
      next();
   });




app.use(newrouter);



app.use(favicon(path.join(__dirname, 'favicon.ico')));

 

mongoose.connect(process.env.NODB , {useNewUrlParser:true , useUnifiedTopology:true ,useFindAndModify:false} ).then((n)=>{}).catch((e)=>console.log(e));
mongoose.set("useCreateIndex",true);

app.get('/',function(req,res){res.render('home',{FAILATTEMPT:v})});

app.get('/register',function(req,res){
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.render('register',{FAILATTEMPT:v})});

app.get('/login',function(req,res){
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.render('login',{FAILATTEMPT:v});
});


 app.get('*',function(req,res){

    res.render("notfound");
  
  });

   

app.listen(process.env.PORT||4000);

//module.exports = csrfProtection;
