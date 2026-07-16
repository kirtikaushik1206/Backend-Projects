const path = require('path');
const express = require ('express');
const mongoose= require("mongoose");
const userRoute = require('./routes/index')
const app = express();
const PORT = 8000;

mongoose.connect(`mongodb://127.0.0.1:27017/blogify`).then(e=> console.log("MongoDb is connected"))
app.set("view engine" , "ejs");
app.set ("views" , path.resolve("./views"));
app.use(express.urlencoded({extended:false}));

app.get('/' , (req,res) =>{
    res.render('home');
})

app.listen(PORT , ()=>{
    console.log(`server started at PORT : ${PORT} `)
});
app.use("/user" , userRoute);
