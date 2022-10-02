const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const path = require("path");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const userModel = require(path.join(__dirname, "../models/userModel.js"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
var cookieParser = require('cookie-parser');
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
    if(token){
        let verify = jwt.verify(token, process.env.SECRET_KEY);
        if(verify){
            const user = await userModel.findOne({_id: verify._id});
            if(user){
                res.status(201).json({token: token, userData: user});
            }else{
                res.status(201).status(null);
            }
        }else{
           res.status(201).json(null);
        }
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
        res.status(201).json({token: token, userData: user});   
        
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
        verifiedStatus: "false",
        adminStatus: 'false'
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
const  removeFriend = async(req, res)=> {
    let friendid = req.body.id
    
    let token = req.cookies.jwt_secure;
    if(token){
      let verify = jwt.verify(token, process.env.SECRET_KEY);
      if(verify){
        const user = await userModel.findOne({_id: verify._id});
        if(user){
           let friends =  user.friends.filter(friend=> friend.friend !== friendid);
            let updateduser = await userModel.findOneAndUpdate({_id: verify._id}, {friends});
    
            res.status(201).json(updateduser)
        }
      
      }
      
    }

}
async function getAllUsers(req, res){
    try {
        let users = await userModel.find();
        res.status(201).json(users);
    } catch (err) {
        res.status(500).json("err")
    }
    
}
async function getUsersByPage(req, res){
    let reqPage = req.params.page;
    let pagelimit = 10;
    reqPage--;
    try{
      const totalRecords = await userModel.countDocuments();
      const users = await userModel.find().limit(pagelimit).skip(reqPage * pagelimit);
      let totalpages = Math.ceil(totalRecords / pagelimit);
      reqPage++;
      res.status(201).json({users: users,currentPage: reqPage, totalPages: totalpages})
    }catch(err){
        res.status(500).json(err)

    }
    
}
async function updateUserStatus(req, res){
    try{
        let data = {};
        if(req.body.hasOwnProperty('activeStatus')){
            let activeStatus = JSON.stringify(req.body.activeStatus);
           data = {...data, 'activeStatus': activeStatus};
        }
        if(req.body.hasOwnProperty('verifiedStatus')){
            let verifiedStatus = JSON.stringify(req.body.verifiedStatus);
            data = {...data, 'verifiedStatus': verifiedStatus};
        }
        console.log(data)
     const user = await userModel.findOneAndUpdate({_id: req.body.userid}, data);
     if(user){
        res.status(201).json(user);
     }else{
        res.status(500).json("No user Found");
     }
    }catch(err){
        console.log(err)
    }
}

async function getUserCount(req, res){
  try{
     const count = await userModel.countDocuments();
     res.status(201).json(count);
  }catch(err){
    res.status(500).json(err);
  }
}

async function getUserDataByToken(req, res){
    let token = req.params.token;

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
function sendCodeMail(recipient, code){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'testweb010190@gmail.com',
          pass: 'ksstmknsyucgtwxt'
        }
      });
      var mailOptions = {
        from: 'testweb010190@gmail.com',
        to: recipient,
        subject: 'User Account Verification',
        text: `Your account verification code is:  ${code} `,
        html: `Your account verification code is:<br /> <b> ${code}</b> `
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

} 

  

  

async function sendVerificationCodeByEmail(req, res){
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    let recipientmail = req.body.recipientmail;
    sendCodeMail(recipientmail, randomCode);
    res.status(201).json(randomCode);
}
async function updateVerificationStatus(req, res){
   try{
     userModel.findOneAndUpdate({_id: req.body.userid}, {verifiedStatus: req.body.verifiedStatus}).then((response)=> {
        console.log(response);
        res.status(201).json(response);

     })
   }catch(err){
    res.status(201).json(err);
   }
}
async function getUserFriends(req, res){
    console.log(req.socket.remoteAddress)
    console.log(req.params.id);
    try{
      const users = await userModel.find({"friends.friend":  req.params.id});
      console.log(users);
      res.status(200).json(users);
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}

module.exports = {userLogin, userRegister,logoutUser, getUserToken, getUserData, getDataById, profileUpdate, getSearchUsers, friendsAdd,  getAllUsers, getUserDataByToken, getUserCount, updateUserStatus,  getUsersByPage, sendVerificationCodeByEmail, updateVerificationStatus, getUserFriends, removeFriend};