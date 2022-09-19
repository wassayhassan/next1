const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const path = require("path");
const bcrypt = require("bcrypt");
const userModel = require(path.join(__dirname, "../models/userModel.js"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
var cookieParser = require('cookie-parser')
app.use(cookieParser());

async function getUserData(req, res){
  let token = req.cookies.jwt_secure;

  if(token){
    let verify = jwt.verify(token, process.env.SECRET_KEY);
    if(verify){
        const user = await userModel.findOne({_id: verify._id});
        if(user){
            res.status(201).json(user);
        }else{
            res.staus(201).json(null);
        }
    }else{
        res.status(201).json(null);
    }
  }else{
    res.status(201).json(null);
}
}

async function logoutUser(req, res){
  res.clearCookie('jwt_secure');
  res.status(201).json("Cookie Successfully Cleared");
}

async function getUserToken(req, res){
    console.log('user toke funcrino called');
    let token = req.cookies.jwt_secure;
    console.log(token);
    if(token){
        res.status(201).json(token);
    }else{
        res.status(201).json(null);
    }
}

async function userLogin(req,res) {
    
    console.log("process env:  "+process.env.SECRET_KEY);
    console.log("token:     "+req.cookies.jwt_secure);
     const user  = await userModel.findOne({email: req.body.email});
     console.log(user);
     if(user !== null){
     const compare  = await bcrypt.compare(req.body.password, user.password);
     console.log(compare);
     if(compare){
        let token = await user.generateAuthToken();
        res.cookie("jwt_secure", token, {
            expires: new Date(Date.now() + 86400000),
            httpOnly: true
           });
        res.status(201).json(token);   
        
        //es.json({status: 'ok', user: 'true', passwordmatch: "true"});
     }else{
        res.status(201).json("Wrong Password");
        //res.json({status: 'ok', user: 'true', passwordmatch: 'false'});
     }
    }else{
        res.status(201).json("No User Found");
       // res.json({status: 'ok', user: 'false', passwordmatch: null});
    }
}
async function userRegister(req, res){
    console.log(req.body);
   const userFound = await userModel.findOne({email: req.body.email});
    if(userFound === null){
        console.log();
    let user = new userModel({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        activeStatus: "true",
        verifiedStatus: "false"
    });
    console.log(user);
    user.save().then((response)=> {
        console.log(response);
        res.send(response);
        console.log("user successfully saved");
    })
   }else{
    res.status(201).json("User Already Registered");
   }
}
async function getDataById(req, res){
    let token = req.params.id;
    if(token === undefined){
        res.status(201).json("No User found");
    }
    
    
      if(token){
          const user = await userModel.findOne({_id: token});
          if(user){
              res.status(201).json(user);
          }else{
              res.staus(201).json(null);
          }
      
    }else{
      res.status(201).json(null);
  }
}
async function profileUpdate(req, res){
    console.log(req.body);
    // let udata = {...req.body, 'profilepic': profilepic, 'headerpic': headerpic};
    let udata = {...req.body};

    if(req.files['profilepic']){
        let profilepic = req.files['profilepic'][0].filename;
        udata = {...udata, 'profilepic': profilepic}
    }
    if(req.files['headerpic']){
        let headerpic = req.files['headerpic'][0].filename;
        udata = {...udata, 'headerpic': headerpic}
    }

    let token = req.cookies.jwt_secure;
    if(token){
      let verify = jwt.verify(token, process.env.SECRET_KEY);
      let updateduser = await userModel.findOneAndUpdate({_id: verify._id}, udata)
    
      res.status(201).json(updateduser)
    }
}
async function getSearchUsers(req, res){
    console.log(req.params.name);
  let searchname = req.params.name;
  let foundusers  = await userModel.find({ "username": { $regex: searchname, $options: 'i'} });
  res.status(201).json(foundusers);
}
async function friendsAdd(req, res){
    const opts ={new: true};
    console.log(req.body);
    let friendid = req.body.id
    
    let token = req.cookies.jwt_secure;
    if(token){
      let verify = jwt.verify(token, process.env.SECRET_KEY);
      if(verify){
        const user = await userModel.findOne({_id: verify._id});
        if(user){
           let friends =  user.friends.concat({friend: friendid});
            let updateduser = await userModel.findOneAndUpdate({_id: verify._id}, {friends}, opts);
    
            res.status(201).json(updateduser)
        }
      
      }
      
    }
}

module.exports = {userLogin, userRegister,logoutUser, getUserToken, getUserData, getDataById, profileUpdate, getSearchUsers, friendsAdd};