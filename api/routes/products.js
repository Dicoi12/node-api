const express=require('express');
const router=express.Router();
const mongoose=require('mongoose')
const multer=require('multer')
const checkAuth=require('../middleware/check-auth')

const storage=multer.diskStorage({
    destination:function(req,file,cb){
cb(null,'./uploads/')
    },
    filename:function(req,file,cb){
        cb(null, Date.now() + file.originalname)
    }
})

const fileFilter=(req,file,cb)=>{
    if(file.mimetype==='image/png'||file.mimetype==='image/jpeg'){
    cb(null,true)}
    else{
    cb(null,false)}
}
const upload=multer({
    storage:storage,limits:{
    filesize:1024*1024*5
},fileFilter:fileFilter
}
)


const Product=require("../models/product")

//getall products
router.get('/',(req,res,next)=>{
 Product.find()
 .select('name price _id tags description productImage')
 .exec()
 .then(docs=>{
    const response={
        count:docs.length,
        products:docs.map(doc=>{
            return{
                name:doc.name,
                price:doc.price,
                tags:doc.tags,
                description:doc.description,
                productIamge:doc.productImage,
                _id:doc._id,
                request:{
                    type:'GET',
                    url:'http://localhost:3000/products/'+doc._id
                }
            }
        })
    }
        res.status(200).json(response);
       
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

  //adauga produs form type
router.post('/',upload.single('productImage'),checkAuth,(req,res,next)=>{
    
    const product=new Product({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.number,
        tags:req.body.tags,
        description:req.body.description,
        productImage:req.file.path
    })
    product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
            name: result.name,
            price: result.price,
            _id: result._id,
            tags:result.tags,
            description:result.description,
            productImage:result.productImage,
            request: {
                type: 'GET',
                url: "http://localhost:3000/products/" + result._id
            }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

//returneaza un singur produs dupa id
router.get("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
      .select('name price _id productImage')
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) {
          res.status(200).json({
              product: doc,
              request: {
                  type: 'GET',
                  url: 'http://localhost:3000/products'
              }
          });
        } else {
          res
            .status(404)
            .json({ message: "No valid entry found for provided ID" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  });

//modifica elementele unui produs
router.patch('/:productId',(req,res,next)=>{
    const id=req.params.productId;

    Product.findByIdAndUpdate(id, { $set: req.body }, { new: true})
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json({ error: err}))
})
   
//sterge produsul dupa id
router.delete('/:productId',(req,res,next)=>{
    const id=req.params.productId;
    Product.findByIdAndRemove(id)
    .exec()
    .then(result=>{
        res.status(200).json(result)
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({error:err})
    })
 })
 
module.exports = router;