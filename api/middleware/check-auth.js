const jwt=require('jsonwebtoken')
const JWT_KEY='secret'
module.exports=(req,res,next)=>{
    try{
    //const token=req.headers.authorisation.split(" ")[1]
    const decoded=jwt.verify(req.body.token,JWT_KEY)
    req.userData=decoded
    next();
}
    catch(error){
        return res.status(401).json({
            message:"Auth failed"
        })
    }
}