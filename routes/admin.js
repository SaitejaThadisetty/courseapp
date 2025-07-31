const {Router}=require('express');
const adminRouter=Router();
const {z}=require('zod');
const bcrypt=require('bcrypt');
const { adminModel} = require('../db');
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
    }
    catch(e){
        res.status(403).json({
            msg:"User already exists"
        })
        return ;
    }
    res.json({
        msg:"User created Successfully"
    })
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
    const isPasswordCorrect=bcrypt.compare(password,admin.password);
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

adminRouter.put('/course',adminMiddleWare,(req,res)=>{

});

adminRouter.post('/course',adminMiddleWare,(req,res)=>{

});

adminRouter.get('/course/bulk',adminMiddleWare,(req,res)=>{

});

module.exports={
    adminRouter
}