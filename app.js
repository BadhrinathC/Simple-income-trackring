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


const app = express();
 

let v = " ";
let n = " ";

app.use(helmet());

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

app.use(newrouter);



app.use(favicon(path.join(__dirname, 'favicon.ico')));

 

mongoose.connect(process.env.NODB , {useNewUrlParser:true , useUnifiedTopology:true ,useFindAndModify:false} ).then((n)=>{}).catch((e)=>console.log(e));
mongoose.set("useCreateIndex",true);

app.get('/',function(req,res){res.render('home',{FAILATTEMPT:v})});

app.get('/register',function(req,res){res.render('register',{FAILATTEMPT:v})});

app.get('/login',function(req,res){res.render('login',{FAILATTEMPT:v})});


 app.get('*',function(req,res){

    res.render("notfound");
  
  });

   

app.listen(process.env.PORT||4000);

