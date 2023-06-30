const express=require('express');
const router=express.Router();

router.get('/',(req,res,next)=>{
    

    res.status(200).json({
       

        message:'orders were fetcherd'
       
       

    })
})
router.post('/',(req,res,next)=>{
    const order={
        productId:req.body.productId,
        quantity:req.body.quantity
    }
    res.status(201).json({
        
        message:'orders was created',
        order:order
       
    })
})
router.post('/:orderId',(req,res,next)=>{
    const order={
        productId:req.body.productId,
        quantity:req.body.quantity
    }
    res.status(201).json({
        
        message:'orders was created',
        order:order
       
    })
})
    router.delete('/:orderId',(req,res,next)=>{
        res.status(200).json({
             
            message:'orders deleted',
            orderId:req.params.orderId
    
           
        })
})
module.exports = router;