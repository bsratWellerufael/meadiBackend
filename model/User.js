const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
//const cookie_parser=require('cookie-parser')
const userSchema=mongoose.Schema({
    resName:{
        type:String,
        required:true
    },
    resOwner:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    phone:{
        type:Number,
        require:true
    },
    address:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    resState:{
        type:String,
        required:true
    },
    password:{
        type:String,
        requirde:true,
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