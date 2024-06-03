const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const {isEmail}=require('validator')
//const { validate } = require('./Menu')
//const cookie_parser=require('cookie-parser')
const userSchema=mongoose.Schema({
    resName:{
        type:String,
        required:[true,'please enter resturant name']
    },
    resOwner:{
        type:String,
        required:[true,'please enter owners name']
    },
    email:{
        type:String,
        required:[true, 'please enter an email'],
        unique:true,
        lowercase:true,
        validate:[isEmail,'please enter a valid email']
    },
    phone:{
        type:Number,
        required:[true,'please enter phone number']
    },
    address:{
        type:String,
        required:[true,'please enter address']
    },
    city:{
        type:String,
        required:[true,'please enter city']
    },
    resState:{
        type:String,
        required:[true,'please enter state']
    },
    password:{
        type:String,
        required:[true, 'please enter password'],
        minlength:[8,'make it strong password']
    }
})
// we hashed the user password!
userSchema.pre('save', async function(next){
   const salt=await bcrypt.genSalt()
    this.password=  await bcrypt.hash(this.password,salt)
    next()
})
// static methode to login
userSchema.statics.login=async function(email,password){
    // check the user if exist in db
    const user =await this.findOne({email})
    if(user){
            const auth= await bcrypt.compare(password,user.password)
            if(auth){
             return user
            }
            throw Error('password is not matched')
    }
    throw Error('email is not correct!')
}

const User=mongoose.model('user',userSchema)

module.exports=User