const {createHmac , randomBytes}= require("crypto");


const {Schema , model  } = require ('mongoose');
const { createTokenForUser } = require("../services/authentication");

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
 userSchema.pre("save" , async function(){
    if(!this.isModified("password")) return;
    const salt= randomBytes(16).toString(); //generated salt
   const hashedPassword= createHmac("sha256" , salt)
   .update(this.password)
   .digest("hex");

   this.salt = salt;
   this.password= hashedPassword;

   
 });
 
 // we will make a Virtual function 

 userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error('User not found!');

  const salt = user.salt; // Database se purana saved salt nikala
  const hashedPassword = user.password;

  const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (hashedPassword !== userProvidedHash) throw new Error('Incorrect Password');
  const token = createTokenForUser(user);
  return token;
});



const User = model('user' , userSchema);

module.exports = User;