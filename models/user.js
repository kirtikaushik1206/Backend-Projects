const {createHmac , randomBytes}= require("crypto");


const {Schema , model  } = require ('mongoose')

const userSchema = new Schema( {
    fullName:{
        type: String,
        required: true,
        
    },
email:{
    type: String,
    required:true,
    unique: true,
},

salt:{
    type:String,
    required:true,
},

password:{
    type:String,
    required:true,
  


},

profileImageURL:{
type:String,
default: "/images/default1.png",

},
role:{
    type:String,
    enum: ["USER", "ADMIN"],
    default:"USER",
}

},
{timestamps:true}
);
 // Mongoose middleware mein hamesha regular function likhte hain kyunki this ke through hi current document ka data milta hai — arrow function mein woh context lost ho jaata hai!
 userSchema.pre("save" , function(next){
    if(!user.isModified("password")) return;
    const salt= randomBytes(16).toString(); //generated salt
   const hashedPassword= createHmac("sha256" , salt)
   .update(user.password)
   .digest("hex");

   this.salt = salt;
   this.password= hashedPassword;

   next();
 });

const User = model('user' , userSchema);

module.exports = User;