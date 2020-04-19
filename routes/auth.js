const jwt = require('jsonwebtoken');
require('dotenv').config();
const {User} = require('../model/users');


const auth = async (req,res,next) =>{
    try 
    { 
      const cook = req.cookies
      const token = req.cookies.auth;
      //console.log(req.cookies.auth);
      if(!token){res.render("home",{FAILATTEMPT:"LOGIN TO ACCESS PAGE"})}
      const decode = jwt.verify(token,process.env.KEY,{algorithm:"HS256"});
      const user = await User.findOne({_id:decode._id})
      if(!user)
      {
          return null;
      }
      
      req.user=user;
      next();
    }
    catch(e)
    {
      // console.log("888",e);
      // console.log("100",e.name);
      return e.name
      // if(e.name == "JsonWebTokenError")
      // {
      //    res.render("login",{FAILATTEMPT:"LOGIN TO ACCESS PAGE"})
      // }
    }
}

module.exports = auth;

