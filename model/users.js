require('dotenv').config();
const mongoose = require('mongoose');
const validator = require('validator');
const argon2 = require('argon2');
const dateonly = require('mongoose-dateonly')(mongoose)


const secUser = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    validate(value)
    {
      if(!validator.isEmail(value)){ throw new Error("Not a valid email") }
    }
  },
  password: {
    type: String,
    required: true,
    minlength:[10,"Minimum length required is ten"]
  },
  devicename:{
    type:String,
    default:"none"
  },
  balance:{
    type:Number,
    default:0
  },
  totalinc:{
    type:Number,
    default:0
  },
  totalout:{
    type:Number,
    default:0
  }

});

secUser.virtual('incomes',{
  ref:'income',
  localField:'_id',
  foreignField:'email'
})

secUser.virtual('expenses',{
  ref:'expense',
  localField:'_id',
  foreignField:'email'
})

const monthinc = new mongoose.Schema({

  money:{
     type:String
  },

  titlebox:{
    type:String,
    required:true,
    validate(value)
    
    {
      if(!validator.isAlphanumeric(value)){ throw new Error("Please enter valid terms") }
    }

  },
  cost:{
    type:Number
  },
  email:{
    type:mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  time:{type:dateonly,
    default:new dateonly(Date.now())}  

});

const monthexp = new mongoose.Schema({

  money:{
    type:String
 },
  titlebox:{
    type:String,
    required:true,
    validate(value)
    
    {
      if(!validator.isAlphanumeric(value)){ throw new Error("Please enter valid terms") }
    }
  },
  cost:{
    type:Number
  },
  email:{type:mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  time:{type:dateonly,
    default:new dateonly(Date.now())}

});



secUser.pre('save', async function(next)
{
   const user = this;
   user.password = await argon2.hash(user.password,{type: argon2.argon2id,hashLength:60,saltLength:20});
   
   next();
});



const User = mongoose.model('User',secUser);
const income = mongoose.model('income',monthinc);
const expense = mongoose.model('expense',monthexp);
module.exports = {User,income,expense} ;

