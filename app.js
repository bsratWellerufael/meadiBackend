const express=require('express')
const cors=require('cors')
const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const User=require('./model/User')
const Menu=require('./model/Menu')
const Order=require('./model/Order')
const multer= require ('multer')
//connect to mongodb
mongoose.connect('mongodb://127.0.0.1:27017/meadi')
.then(()=>{
    app.listen(4000,()=>{
        console.log('server is run on port 4000')
    })
})
.catch((err)=>{
    console.log(err)
})

const app=express()
app.use(cors())
app.use(express.json())

//handle errors
 const handleErrors=(err)=>{
      console.log(err.message,err.code)
     let errors={resName:"",resOwner:"",email:"",phone:"",address:"",city:"",resState:"",password:""}
       
     // duplicate key error
     if(err.code===11000){
        errors.email='that email is already registered'
        return errors;
     }
        //validate error
     if(err.message.includes("user validation failed")){
          (Object.values(err.errors)).forEach(({properties})=>{
            errors[properties.path]=properties.message
          }) 
          return errors;
       }
    }

//generate the token 
const createToken=(id)=>{
    return jwt.sign({ id },'meadi-food')
}
//creating the local storage 
const Storage=multer.diskStorage({
   destination:function(req,file,cb){
       cb(null,"../meadi/public")
   },
   filename:function(req,file,cb){
       cb(null,Date.now()+ file.originalname)
   }
})

const upload=multer({
    storage:Storage
})

app.post('/owner_detail',async (req,res)=>{
    const {resName,resOwner,email,phone,address,city,resState,password}=req.body
    try{
        const owner= await User.create({resName,resOwner,email,phone,address,city,resState,password})
        res.status(201).send('user is created')
    }
    catch(err){
          const errors=handleErrors(err)
          res.json({errors})
    }
})

app.post('/food-menu',upload.single('image'),async(req,res)=>{
  const {foodName,describtion,price,catagory,ingrident,resName}=req.body         
  try{
    const menu=await Menu.create(
        {foodName,describtion,
           price,catagory
          ,ingrident,
          image:req.file.filename,
          resName
         }
      )
       res.send("succssfuly uploaded")
  }
  catch{
      res.status(400).send("menu can't created")
  }
})

app.post(('/meadi-food-menu'),async(req,res)=>{
    const {resName}=req.body
    const menu=await Menu.find({resName})
    res.status(201).json(menu)
})

app.get('/resturant-list' ,async function(req,res){
       const resturnats= await User.find()
            res.status(201).json(resturnats)
})

app.post('/customer',async(req,res)=>{
    const{name,phone,address,quantity,resNames,foodNames}=req.body
    try{
         const order=await Order.create({name,phone,address,quantity,resNames,foodNames})
         res.status(201).send('Thank you order is arrived')
       }
    catch(err){
             res.status(400).send('Sorry try again')
    }
})

app.get('/order-summery' ,async(req,res)=>{
        const order=await Order.find()
        res.status(201).json(order)
})

app.post('/login',async function(req,res){
      const {email,password}=req.body
     try{
        const user=  await User.login(email,password)
        const token=createToken(user._id)
        res.header('Content-Type:Application/json')
        res.status(201).send(token)
     }
    catch(err){
        res.status(400).send("can't loged in")
    }
})