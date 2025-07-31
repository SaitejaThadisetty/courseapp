const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userSchema=new Schema({
    email:{type:String, unique:true},
    password:String,
    firstName:String,
    lastName:String
});

const adminSchema=new Schema({
    email:{type:String, unique:true},
    password:String,
    firstName:String,
    lastName:String
});

const courseSchema=new Schema({
    title:String,
    description:String,
    price:Number,
    imageUrl:String,
    creatorId:ObjectId
});

const purchaseSchema=new Schema({
    courseId:ObjectId,
    userId:ObjectId
});


const userModel=mongoose.model('User',userSchema);
const adminModel=mongoose.model('Admin',adminSchema);
const courseModel=mongoose.model('Course',courseSchema);
const purchaseModel=mongoose.model('Purchase',purchaseSchema);


module.exports={
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}