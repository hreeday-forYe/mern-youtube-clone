import mongoose, {Schema} from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const userSchema = new Schema({

  username: {
    type: String,
    required: true,
    unique:true,
    trim:true,
    lowercase:true,
    index:true
  },
  email: {
    type: String,
    required: true,
    unique:true,
    trim:true,
    lowercase:true
  },
  
  fullName: {
    type: String,
    required: true,
    trim:true,
    index:true
  },

  avatar: {
    type:String, // Cloudinary URL 
    required: true,

  },
  coverImage: {
    type: String, // CLoudinary URL
  },
  watchHistory:[
    {
      type: Schema.Types.ObjectId,
      ref: "Video"
    },
  ],
  password:{
    type: String,
    required: [true, "Password is required"]
  },

  refreshToken:{
    type: String
  }
  

},{
  timestamps: true
})


// Pre hooks
userSchema.pre("save", async function(next){
  if(!this.isModified("password")){
    return next()
  }
  this.password = await bcrypt.hash(this.password, 10);
  next()
})

userSchema.methods.comparePassword= async function (password){
  return await bcrypt.compare(password, this.password); // Returns true or false
}

/*
ACCESS TOKEN 
*/
userSchema.methods.generateAccessToken = function ( ){
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName 
    }, // this is the payload

    process.env.ACCESS_TOKEN_SECRET, // access token secret
    
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY // Expiry Object
    }
  )
}

/*
REFRESH TOKEN 
*/ 
userSchema.methods.generateRefreshToken = async function ( ){
  return jwt.sign(
    {
      _id: this._id,
    }, // this is the payload

    process.env.REFRESH_TOKEN_SECRET, // access token secret
    
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY // Expiry Object
    }
  )
}

export const User = mongoose.model("User", userSchema);
