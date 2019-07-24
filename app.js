var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var User = require('./models/user');
var cors = require('cors');
mongoose.connect("mongodb://localhost:27017/credential",{useNewUrlParser:true});

app.use(bodyParser.json());

var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}
  
app.use(cors(corsOptions))

// app.get("/login",function(req,res){

// })

app.post("/loginAuth",(req,res,next)=>{
    var email1  = req.body.email;
    var password1 = req.body.password;
    // console.log(req);
    // console.log(email1 + " " + password1);
    User.findOne({ $and: [{email : email1}, {password : password1}] }).exec(function(err,data){
        if(err){
            console.log(err);
            return next(err);
        }if(!data){
            // alert("User not found");
        }else if (data){
            // console.log("success");
            // console.log(data);
            // app.get("/login",function(req,res){
            // console.log("After login");
                return res.json(data); 
            // });
        }
    });
});

app.post("/signup/",(req,res,next) => {
    var newEmail = req.body.email;
    User.findOne({email : newEmail},function(err,data){
        if(err){
            console.log(err);
        }
        if(data){
            var err = new Error('A user with that email has already registered. Please use a different email..');
            err.status = 400;
            return next(err);
        }else {
            User.create(req.body,function(err,data){
                if(err){      
                    console.log("Error while signing up");
                }else{
                    console.log(data);
                }
            });
        }
    });
});

// app.post();

app.listen(3000,function(req,res){
    console.log("SERVER HAS STARTED");
});