const express=require('express');
const app=express();
const morgan=require('morgan');
const mongoose=require('mongoose')

//routes
const productRoutes=require('./api/routes/products');
const orderRoutes=require('./api/routes/orders');
const userRoutes=require('./api/routes/user')
const bodyParser=require('body-parser');


//link to mongodb cluster
mongoose.connect("mongodb+srv://winkode12:admin1234@cluster0.9agbae5.mongodb.net/?retryWrites=true&w=majority"
  )


app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
//prevent corse error
app.use((req,res,next)=>{
    res.header('Acces-Control-Allow-Origin','*')
    res.header('Acces-Control-Allow-Headers','Origin, X-Requested-Width, Content-Type, Accept, Autorization')
    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET')
        return res.status(200).json({});
    }
    next()
})
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/user',userRoutes)



//tratarea erorilor sa nu mai apara sub forma de html
app.use((req,res,next)=>{
    const error=new Error('Not Found')
    error.status=404;
    next(error);
})
app.use((error,req,res,next)=>{
    res.status(error.status||500);
    res.json({
        error:{
            message:error.message
        }
    })
})
module.exports=app;