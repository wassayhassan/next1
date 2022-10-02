const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    email: { type: String, required: true},
    password: String,
    activeStatus: String,
    verifiedStatus: String,
    adminStatus: String,
    profilepic: String,
    headerpic: String,
    friends: [
        {
            friend: {
               type: String
            }
        }
    ],
    location: String,
    tokens: [
        {
            token: {
                type: String
            }
        }
    ]
}, {
    timestamps: true
});
userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password  = await bcrypt.hash(this.password, 10);
    }
    next();
});
userSchema.methods.generateAuthToken = async function(){
   let token = jwt.sign({_id: this._id}, process.env.SECRET_KEY);
   this.tokens = this.tokens.concat({token: token});
   await this.save();
   return token;
}


const userModel = new mongoose.model("Users", userSchema);

module.exports = userModel;