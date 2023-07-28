const express=require('express');
const router=express.Router();
const mongoose=require('mongoose')
const checkAuth=require('../middleware/check-auth')




const Product=require("../models/product")

//getall products
// get all products
router.get('/', (req, res, next) => {
  Product.find()
    .exec()
    .then(docs => {
      const products = docs.map(doc => ({
        _id: doc._id,
        name: doc.name,
        price: doc.price,
        tags: doc.tags,
        cookTime: doc.cookTime,
        imageUrl: doc.imageUrl,
        quantity: doc.quantity
      }));
      
      res.status(200).json(products);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


  //adauga produs form type
router.post('/',(req,res,next)=>{
    
    const product=new Product({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price,
        cookTime:req.body.cookTime,

        tags:req.body.tags,
        imageUrl:req.body.imageUrl,
        quantity:req.body.quantity

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
            cookTime:result.cookTime,

            imageUrl:result.imageUrl,
            quantity:result.quantity
            
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