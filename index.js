const express=require('express');
const jwt=require('jsonwebtoken');
const mongoose=require('mongoose')
require('dotenv').config()

const app=express();

const{userRouter}=require('./routes/user')
const{adminRouter}=require('./routes/admin')
const{courseRouter}=require('./routes/course')


app.use(express.json());
app.use('/user',userRouter);
app.use('/admin',adminRouter);
app.use('/course',courseRouter);

async function main(){
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected Successfully")
    }
    catch(err){
        console.log("Connection error:",err);
    }
    
    app.listen(3000);
}
main();