const {Router}=require('express');
const userRouter=Router();
const{userModel}=require("../db")
const{z}=require('zod')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const {JWT_USER_PASSWORD}=require('../config')

userRouter.post('/signup',async (req,res)=>{
    // this is input validation using zod library
    const requiredBody=z.object({
        email:z.string().min(3).email(),
        password:z.string().min(3),
        firstName:z.string().min(3),
        lastName:z.string().min(3)
    })

    const parsedDataWithSuccess=requiredBody.safeParse(req.body);
    if(!parsedDataWithSuccess.success){
        res.status(403).json({
            message:"Incorrect format",
            error:parsedDataWithSuccess.error
        })
        return
    }

    // this is where we push the data into db
    const {email,password,firstName,lastName}=req.body; //destructuring the request body

    try{
        // this is password hashing using bcrypt library, where we basically hash the password using some algo and push that password into database
        const hashedPassword=await bcrypt.hash(password,5);
        console.log(hashedPassword)
        await userModel
        .create({
            email:email,
            password:hashedPassword,
            firstName:firstName,
            lastName:lastName
        });
        res.json({
            msg:"User created Successfully"
        })
    }
    catch(e){
        //Checking if user already exists
        if(err.code===11000){
            return res.status(400).json({
                msg:"Email already exists"
            })
        }
        //Unexpected errors
        console.log("Signup error:",e);
        res.status(500).json({
            msg:"Something went wrong"
        })
        return ;
    }
    
});

userRouter.post('/signin',async(req,res)=>{
    const{email,password}=req.body;
    const user=await userModel.find({
        email:email
    })
    if(user){
        const token =jwt.sign({
            id:user._id
        },JWT_USER_PASSWORD);
        res.json({
            token:token
        })
    }
    else{
        res.status(403).json({
            msg:"Invalid user"
        })
    }
});

userRouter.get('/purchases',(req,res)=>{

})

module.exports={
    userRouter:userRouter
}