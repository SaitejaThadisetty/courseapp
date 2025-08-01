const {Router}=require('express');
const adminRouter=Router();
const {z}=require('zod');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')
const { adminModel, courseModel} = require('../db');
const {JWT_ADMIN_PASSWORD}=require('../config')
const {adminMiddleWare}=require('../middleware/admin')

adminRouter.post('/signup',async (req,res)=>{

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
        // console.log(hashedPassword)
        await adminModel
        .create({
            email:email,
            password:hashedPassword,
            firstName:firstName,
            lastName:lastName
        });
        res.json({
            msg:"admin created successfully"
        })
    }
    catch(e){
        //check the type of error first
        //if user exists error
        if(e.code===11000){
            return res.status(403).json({
                msg:"Email already exists"
            })
        }
        //other unexpected errors
        console.log("Signup error:",e);
        res.status(500).json({
            msg:"Something went wrong"
        })
        
    }
});

adminRouter.post('/signin',async(req,res)=>{
    const{email,password}=req.body;
    const admin=await adminModel.findOne({
        email:email
    })
    if(!admin){
        return res.status(403).json({
            msg:"Invalid admin user"
        })
    }
    const isPasswordCorrect=await bcrypt.compare(password,admin.password);
    if(!isPasswordCorrect){
        return res.status(403).json({
            msg:"Incorrect password"
        })
    }
    const token=jwt.sign({
        id:admin._id
    },JWT_ADMIN_PASSWORD);
    res.json({
        token:token
    })

});

adminRouter.put('/course',adminMiddleWare,async(req,res)=>{
    const creatorId=req.userId;
    const{title,description,price,imageUrl}=req.body;
    try{
        const course=await courseModel.updateOne({
            title,description,price,imageUrl,creatorId
        })
        res.json({
            msg:"Course updated successfully",
            courseId:course._id
        })
    }
    catch(e){
        console.log("Error is:",e)
        res.status(500).json({
            msg:"Database error",
        })
    }
});

adminRouter.post('/course',adminMiddleWare,async(req,res)=>{
    const creatorId=req.userId;
    const{title,description,price,imageUrl}=req.body;
    
    try{
        const course=await courseModel.create({
        title,description,price,imageUrl,creatorId
        })
        res.json({
            msg:"Course created successfully",
            courseId:course._id
        })
    }
    catch(e){
        console.log("Error:",e);
        req.status(500).json({
            msg:"db error"
        })
    }
    
});

adminRouter.get('/course/bulk',adminMiddleWare,async(req,res)=>{
    const creatorId=req.userId;
    const courses=await courseModel.find({
        creatorId
    })
    res.json({
        courses
    })
});

module.exports={
    adminRouter
}
