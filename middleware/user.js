const jwt=require('jsonwebtoken');
const {JWT_USER_PASSWORD}=require('../config');

function userMiddleWare(req,res,next){
    const token=req.headers.token;
    const decoded=jwt.verify(token,JWT_USER_PASSWORD);

    if(decoded){
        
    }
}

module.exports={
    userMiddleWare:userMiddleWare;
}