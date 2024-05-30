const mongoose=require('mongoose')
const orderSchema=mongoose.Schema({
    resNames:{
       type:String,
       required:true
    },
    foodNames:{
      type:String,
      required:true
    },
    name:{
       type:String,
       required:true
    },
    quantity:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
   
},{timestamps:true})
const Order=mongoose.model('order',orderSchema)
module.exports=Order;