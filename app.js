var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var User = require('./models/user');
var Project = require('./models/project');
var cors = require('cors');
// var aws = require('aws-sdk');
var multer = require("multer");
var path = require("path");
var jwt = require("jsonwebtoken");
var fname;
// multerS3 = require('multer-s3'); 
var userId;
var userData = {};

// const aws = require("aws-sdk"), // ^2.2.41
// multer = require("multer"), // "multer": "^1.1.0"
// multerS3 = require("multer-s3"); //"^1.4.1"

require('custom-env').env();


mongoose.connect(process.env.DATABASE +"://" + process.env.DATABASE_IP + ":"+ process.env.DATABASE_PORT + "/" + process.env.DATABASE_NAME , { useNewUrlParser: true });

app.use(bodyParser.json());


app.set('view engine', 'ejs');
var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

app.use(cors(corsOptions));


// Uploading file and store it in aws s3

// aws.config.update({
//     "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY,
//     "accessKeyId": process.env.AWS_ACCESS_KEY,
//     "region": 'ap-south-1'
// });
// var s3 = require('s3-upload-stream')(new AWS.S3());
// const s3 = new aws.S3();

// var upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: "testbucketdrumil",
//         key: function (req, file, cb) {
//             console.log(file);
//             cb(null, file.originalname);
//             console.log(file);
//         }
//     })
// });

//set storage engine

// const storage = multer.diskStorage({
//     destination: './public/uploads/',
//     filename: function (req, file, cb) {
//         console.log(file.fieldname);
//         fname = file.fieldname + "-" + Date.now() + path.extname(file.originalname);
//         cb(null, fname);
//         //   cb(null, file.fieldname + '-' + Date.now())
//     }
// });




// function checkFileType(file, cb) {
//     // Allowed ext
//     const filetypes = /png/;
//     // Check ext
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     // Check mime
//     const mimetype = filetypes.test(file.mimetype);

//     if (mimetype && extname) {
//       return cb(null, true);
//     } else {
//       cb("Error: Upload Videos Only!");
//     }
// }

app.post("/login", (req, res, next) => {
    var email1 = req.body.email;
    var password1 = req.body.password;
    // console.log(req);
    // console.log(email1 + " " + password1);
    User.findOne({ $and: [{ email: email1 }, { password: password1 }] }).exec(function (err, data) {
        if (err) {
            console.log(err);
            // return next(err);
        } if (!data) {
            // alert("User not found");
        } else if (data) {
            // console.log(req.user);
            // console.log("success");
            // console.log(data);
            // app.get("/login",function(req,res){
            // console.log("After login");
            let payload = { subject: data._id }
            console.log(payload);
            let token = jwt.sign(payload, 'secretKey');
            userId = data._id;
            // var verify = jwt.verify(token,'secretKey');
            res.json({ token });
            // });
        }
    });
});

app.post("/signup/", (req, res, next) => {
    var newEmail = req.body.email;
    User.findOne({ email: newEmail }, function (err, data) {
        if (err) {
            console.log(err);
        }
        if (data) {
            var err = new Error('A user with that email has already registered. Please use a different email..');
            err.status = 400;
            return next(err);
        } else {
            User.create(req.body, function (err, data) {
                if (err) {
                    console.log("Error while signing up");
                } else {
                    let payload = { subject: data._id }
                    let token = jwt.sign(payload, 'secretKey');
                    userId = data._id;
                    console.log(data);
                    console.log("In signup ======================");
                    // console.log({token});
                    return res.json({ token });
                }
            });
        }
    });
});

app.post("/userProfile", function (req, res, next) {
    console.log(" ======================================= user profile");
    console.log(req.body);
    var decoded = jwt.decode(req.body.token);
    console.log("decoded " + decoded);
    var user_id = decoded.subject;
    console.log("    " + userId);
    console.log("    " + user_id);
    // console.log(user_id == userId);
    // console.log(typeof(user_id));
    // console.log(typeof(userId));
    if (user_id == userId) {
        User.findById(userId).exec(function (err, data) {
            if (err) {
                console.log("errrooooooo");
                res.json(err);
            } else if (!data) {
                console.log("no data");
            } else {
                userData = data;
                console.log('*****************************' + data);
                res.json(data);
            }
        });
    }
});

app.post('/isLoggedIn',function(req,res){
    console.log("inside IsLogedIn ****************");
    tokenObj = req.body;
    t = jwt.decode(tokenObj.token);
    console.log(t);
    User.findById(mongoose.Types.ObjectId(t.subject)).exec(function(err,data){
        if(err){
            return false;
        } else if (!data){ 
            return false;
        } else {
            return true;
        }
    });
});

app.post('/getUserdata', function (req, res) {
    res.json({ user: userData });
});

app.post("/addProject", (req, res, next) => {
    console.log(req.body);

    // fileName = req.body.projectTitle; 
    // params = { Bucket: 'testbucketdrumil', Key: req.body.projectTitle, Body: req.body.projectFile, ACL: 'public-read' };
    // s3.putObject(params, function (err, data) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    // console.log("upload successfully");
    Project.create(req.body, function (err, data) {
        if (err) {
            console.log(err);
        } if (data) {
            console.log("insert successfully");
        }
    })
});



app.post('/getUserProjects', (req, res, next) => {
    console.log('inside getUserProjects**************************');
    console.log(req);
    tokenObj = req.body.tokenObj;
    console.log(tokenObj);
    var tokenObj = JSON.parse(tokenObj);
    console.log(tokenObj);
    var decoded = jwt.decode(tokenObj.token);
    console.log("In getUserProject" + decoded.subject);
    console.log(typeof (decoded.subject));
    console.log(typeof (mongoose.Types.ObjectId(decoded.subject)));
    var t = mongoose.Types.ObjectId(decoded.subject);
    console.log(t);
    // Project.find({"createdBy.id" : mongoose.Types.ObjectId(t)}).exec(function(err,allUserProejcts){
    Project.find({ 'createdBy': t }).exec(function (err, allUserProejcts) {
        if (err) {
            console.log("Error at getting all projects " + err);
        } else {
            console.log(allUserProejcts);
            res.json(allUserProejcts);
        }
    });
});

app.post('/getProjectDetail', (req,res, next) => {
    console.log(req);
    console.log("Backend project detail");
    // console.log(req.body);
    id = req.body.id;
    Project.findById(mongoose.Types.ObjectId(id)).exec(function(err,data){
        if(err){
            console.log(err);
        }else{
            console.log("project data----------------------");
            console.log(data);
            res.json({projectData : data});
        }
    });
});

app.post('/deleteProject', (req,res,next) => {
    console.log("Inside delete project******************************************");
    console.log(req.body);
    var id = req.body.id;
    Project.findByIdAndDelete(mongoose.Types.ObjectId(id)).exec(function(err, data){
        if(err){
            console.log(err);
        } else {
            console.log(res);
            res.json(data);
        }
    });
});

app.post('/getS3URL', function (req, res) {
    console.log("req.body " + req.body);
    res.json({ URL: 'https://testbucketdrumil.s3.amazonaws.com/' });
});


app.listen(3000, function (req, res) {
    console.log("SERVER HAS STARTED");
});