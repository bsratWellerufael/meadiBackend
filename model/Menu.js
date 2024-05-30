const mongoose=require('mongoose')
const menuSchema= new mongoose.Schema({
    foodName:{
        type:String
    },
    describtion:{
        type:String
    },
    price:{
        type:Number,
    },
    catagory:{
        type:String,
    },
    ingrident:{
        type:String,
    },
    image:{
        type:String
    },
    
    resName:{
        type:String,
    }

})
  const  Menu=mongoose.model('menu',menuSchema)
  module.exports=Menu