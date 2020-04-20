
require('dotenv').config();
const express = require('express');
const router = express.Router();
const {User,income,expense} = require('../model/users');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const auth = require('./auth');
const {regmessage,alertgmessage,regalertadmin,logalertadmin,addalertadmin} = require('./email');
const ratelimit = require('express-rate-limit');
const Fingerprint = require('express-fingerprint');
const neverbounce = require('neverbounce');
const session = require('express-session');

const x="";
const y="";

let output = "";

router.use(session({
  secret:process.env.KEY ,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}))


router.use(Fingerprint({
  parameters:[
      Fingerprint.useragent
  ]
}))


const registerlimiter = ratelimit({
    windowMs: 60 * 60 * 1000, 
    max: 3, 
    handler: function(req,res)
    {
      regalertadmin(req.body.email);
      res.render("register",{FAILATTEMPT:"TOO MANY REGISTER ATTEMPTS TRY AFTER 1 Hour"});
    }
  });

  const loginlimiter = ratelimit({
    windowMs: 30 * 60 * 1000, 
    max: 10, 
    
      handler: function(req,res)
      {
        logalertadmin(req.body.email);
        res.render("login",{FAILATTEMPT:"TOO MANY ATTEMPTS TRY AFTER 1 Hour"});
      }
  });

  const adding = ratelimit({
    windowMs: 15 * 60 * 1000, 
    max: 20, 
    
      handler: function(req,res)
      {
        addalertadmin(req.user.email);
        res.render("details",{AMOUNT:"TOO MANY ATTEMPTS TRY AFTER 1 Hour"});
      }
  });


  ///////////////USER REGISTERS HERE
router.post("/register",registerlimiter,async (req,res) =>
 {
    const user = new User(req.body);
    await User.findOne({email:req.body.email},function(err,found)
    {
      if(err)
      {
          console.log(err);
      }      
      if(found)
      {
        res.render("login",{FAILATTEMPT:"user already exists please login "});
      }
      else
      { 
        const checkmail = new neverbounce({apiKey:process.env.BOUNCE});

       checkmail.single.check(req.body.email).then(
         (result) => {
          // console.log(result.getResult())

           const livemail = result.getResult()

           if(livemail == "valid")
           {
            user.save().then(
              () =>
              {
                
                  res.render("success");
                  regmessage(req.body.email)
                  
          
              }).catch((error)=>
          {   
              console.log(error);
      
              if(error.name === 'ValidationError')
              {
                const ermsg = Object.values(error.errors).map(value => value.message);
                res.render("register",{FAILATTEMPT:ermsg});
              }
      
              else{res.render("register",{FAILATTEMPT:"SOMETHING'S NOT RIGHT CONTACT SUPPORT"});}
              
          });

           }
          else { res.render("register",{FAILATTEMPT:"PLEASE PROVIDE A VALID EMAIL ADDRESS"}); }

         }
       ).catch((e)=>{ console.log(e) });
          
        
} } );

});
/////////////USER LOGS IN
router.post("/login",loginlimiter, async (req,res) =>
{
    
    
     const user =await User.findOne({email:req.body.email},function(err,found){
        
       if(err)
       {console.log(err);}

       if(found)
       { 
           

         
         argon2.verify(found.password,req.body.password).then(
            (c)=>
        {      
            if(c)
            {
                
                const token = jwt.sign({_id:found._id.toString()},process.env.KEY,{algorithm:"HS256"});
                res.cookie('auth',token,{expires: new Date(Date.now() + 900000), httpOnly: true});
                let ba = found.balance;
                let income = found.totalinc;
                let expense = found.totalout;
                let wel = "YOU HAVE " + ba + " IN HAND"
                let incomes = "YOUR TOTAL INCOME IS " + income 
                let expenses = "YOUR TOTAL EXPENSE IS " + expense 
                res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                res.render("dash.ejs",{AMOUNT:wel,TOTALINCOME:incomes,TOTALEXPENSE:expenses});
        
        }
            else{res.render("login",{FAILATTEMPT:"INVALID EMAIL OR PASSWORD"});}
                
            
        }).catch((e)=>{
            
            console.log(e);
            res.render("login",{FAILATTEMPT:"SOMETHING'S NOT RIGHT CONTACT SUPPORT"});
        });
        
        
       }

    });
    
    if(user)
    {
      if(user.devicename == "none")
      { 
 
       const finger = Object.values(req.fingerprint).map(value => value);   
       //const dev = finger[0];
       const devname = finger[1].useragent.os.family;
      // console.log(dev);
       let updfinger =  User.findOneAndUpdate({email:req.body.email},{devicename:devname},{returnOriginal: false}).then((n)=>{}).catch((e)=>{});
   
       }  
       else{
         const updatedfinger = Object.values(req.fingerprint).map(value => value); 
      // console.log("e2e",updatedfinger)  
       const userprint = updatedfinger[1];
       const userprint1 = updatedfinger[1].useragent.os.family;
 
       console.log("new",userprint1)
       
       console.log(user.devicename)

       if( userprint1 != user.devicename){
 
       alertgmessage(user.email,userprint1);
       }
       }
   
    }

    else{
      res.render("login",{FAILATTEMPT:"You are not a user please register"});
    }
    
         
    
    
});

   
router.get("/logout",function(req,res)
{
    res.clearCookie('auth');
    req.session.destroy((err)=>{
      if(err){
        console.log(err);
      }
      res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'); 
      res.redirect("/");

    });
 });

router.get('/dash',auth, async (req,res) =>    // important add auth , make sure auth is in middle 
{
  
  
       // console.log(req.user._id);
      
       const amount = await income.find({email:req.user._id}) 
        const cos = Object.values(amount).map(value => value.cost);
         let out = cos.reduce((a,b)=>a+b,0)
        console.log(out);
        const lost = await expense.find({email:req.user._id})
       const sin = Object.values(lost).map(value => value.cost);
      
       let tan = sin.reduce((a,b)=>a+b,0)
       console.log(tan)

       let satan = out-tan;
      
       let bals = "YOU HAVE " + satan + " IN HAND " ;

       let updatebal = await User.findOneAndUpdate({_id:req.user._id},{balance:satan,totalinc:out,totalout:tan},{returnOriginal: false});

       let out1 = "YOUR TOTAL INCOME IS " + out ;

       let tan1 = "YOUR TOTAL EXPENSE IS " + tan ;

       res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
       res.render('dash',{AMOUNT:bals,TOTALINCOME:out1,TOTALEXPENSE:tan1});

       
       

}
);

router.get('/details',auth,function(req,res) // important add auth , make sure auth is in middle 
{     
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

       res.render('details',{AMOUNT:x})
}
);
///////////USER ADDS EXPENSES
router.post("/details",auth,adding,function(req,res) // important add auth , make sure auth is in middle

{
   console.log(req.body);
   const money = req.body.money;
   const title = req.body.titlebox;
   const cost = req.body.cost;
   res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
   if(money == null || money ==''||title == ''||cost == ''||cost == 0 )
   {
    res.render('details',{AMOUNT:"Please select income or expense and make sure cost is in number greater than 0 "})
   }
   else{
       
    if(money == 'income')
    {
      const inc = new income({...req.body,email:req.user._id})
      inc.save().then((n)=>{res.render('details',{AMOUNT:"Details saved"})}).catch((error)=>{
        console.log(error);
              const ermsg = Object.values(error.errors).map(value => value.name);
                console.log(ermsg)
                if(ermsg[0] === 'CastError')
                {
                res.render("details",{AMOUNT:"Please enter number in cost"});
              }
      
              else{res.render("details",{AMOUNT:"SOMETHING'S NOT RIGHT CONTACT SUPPORT"});}
              
      });
      
    }
    if(money == 'expense')
    {
      const exp = new expense({...req.body,email:req.user._id});
      exp.save().then((n)=>{res.render('details',{AMOUNT:"Details saved"})}).catch((error)=>{
        const ermsg = Object.values(error.errors).map(value => value.name);
                console.log(ermsg)
                if(ermsg[0] === 'CastError')
                {
                res.render("details",{AMOUNT:"Please enter number in cost"});
              }
              else{res.render("details",{AMOUNT:"SOMETHING'S NOT RIGHT CONTACT SUPPORT"});}
              
      });
    }
   }
   


});

router.get('/allincome',auth,async (req,res) =>
{
   let allinc =  await income.find({email:req.user._id})
   res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
   res.render("allincome",{income:allinc})

});

router.get('/allexpense',auth,async (req,res) =>
{
   let allexp =  await expense.find({email:req.user._id})
   res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
   res.render("allincome",{income:allexp})

});


module.exports = router;
