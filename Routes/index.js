const {Router } = require("express");
const router = Router();

router.get("/signin" , (res,req) =>{
    return res.render("signin");

});


router.get("/signup", (req,res) =>{
    return res.render("signup");
});


