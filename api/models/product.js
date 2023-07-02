const mongoose=require("mongoose")

const productSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
     name:String,
        price:Number,
        tags:String,
        description:String,
        productImage:String
})
module.exports=mongoose.model('Product',productSchema);