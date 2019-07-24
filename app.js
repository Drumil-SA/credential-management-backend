var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var User = require('./models/user');
var Project = require('./models/project');
var cors = require('cors');
var aws = require('aws-sdk');
var multer = require("multer");
var path = require("path");

var fname;
mongoose.connect("mongodb://localhost:27017/credential", { useNewUrlParser: true });

app.use(bodyParser.json());
app.set('view engine','ejs');
var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

app.use(cors(corsOptions))

// app.get("/login",function(req,res){

// })
aws.config.update({
    "secretAccessKey": 'mhCWgyVshcH7Zd/eBOcNZatVuYqURTJjSYmmZrpa',
    "accessKeyId": 'AKIAIRO2GSIAHDSSMTAQ',
    "region": 'ap-south-1'
});
// var s3 = require('s3-upload-stream')(new AWS.S3());
const s3 = new aws.S3();

// const upload = multer({
//     storage: multerS3({
//         s3:s3,
//         bucket: 'testbucketdrumil',
//         key: function(req,file,cb){
//             console.log(file);
//             cb(null,file.originalname);
//         }
//     }),
//     limits: { fileSize: 100000000 },
//     fileFilter: function (req, file, cb) {
//         checkFileType(file, cb);
//     }
// });

//set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        console.log(file.fieldname);
        fname = file.fieldname + "-" + Date.now() + path.extname(file.originalname);
        cb(null, fname);
        //   cb(null, file.fieldname + '-' + Date.now())
    }
});

//Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 100000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single("myFile");


function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /png/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Upload Videos Only!");
    }
}

app.post("/login", (req, res, next) => {
    var email1 = req.body.email;
    var password1 = req.body.password;
    // console.log(req);
    // console.log(email1 + " " + password1);
    User.findOne({ $and: [{ email: email1 }, { password: password1 }] }).exec(function (err, data) {
        if (err) {
            console.log(err);
            return next(err);
        } if (!data) {
            // alert("User not found");
        } else if (data) {
            // console.log("success");
            // console.log(data);
            // app.get("/login",function(req,res){
            // console.log("After login");
            return res.json(data);
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
                    console.log(data);
                    return res.json(data);
                }
            });
        }
    });
});


app.post("/addProject", (req, res, next) => {
    // console.log(req);
    // fs.readFile(req.body.projectFile, (err, data) => {
    //     if (err) throw err;
    //     const params = {
    //         Bucket: 'testbucketdrumil', // pass your bucket name
    //         Key: req.body.projectTitle, // file will be saved as testBucket/contacts.csv
    //         Body: JSON.stringify(data, null, 2)
    //     };
    //     s3.upload(params, function(s3Err, data) {
    //         if (s3Err) throw s3Err
    //         console.log(`File uploaded successfully at ${data.Location}`)
    //     });
    //  });
    // multer({
    //     storage: multerS3({
    //         s3:s3,
    //         bucket: 'testbucketdrumil',
    //         key: function(req,file,cb){
    //             console.log(file);
    //             cb(null,file.originalname);
    //         }
    //     }),
    //     limits: { fileSize: 100000000 },
    //     fileFilter: function (req, file, cb) {
    //         checkFileType(file, cb);
    //     }
    // });
    // console.log(req.body);

    // var upload = multer({ storage: storage, });
    // const file = req.file;
    // console.log(file);
    // if (!file) {
    //     const error = new Error('Please upload a file')
    //     error.httpStatusCode = 400
    //     return next(error)
    // }

    upload(req, res, (err) => {
        console.log(req);
        if (err) {
            console.log("hii");
            // res.render('upload', { msg: err });
        } else {
            if (req.file == undefined) {
                console.log("fds");
                // res.render('upload', { msg: 'Error: No File Selected!' });
            } else {
                console.log("file");
              var name = fname;
              var path = req.file.originalname;
  
        console.log(req);
        var newFile = {
          name: name,
          path: path
        };
        console.log(newFile);
    }
}
    });
    // params = { Bucket: 'testbucketdrumil', Key: req.body.projectTitle , Body : req.body.projectFile};
    // s3.putObject(params,function(err,data){
    //     if(err){
    //         console.log(err);
    //     }else{
    //         console.log("upload successfully");
    //     }
    // });
    // upload(req, res, (err) => {
    //     if (err) {
    //         res.render('upload', { msg: err });
    //     } else {
    //         if (req.file == undefined) {
    //             res.render('upload', { msg: 'Error: No File Selected!' });
    //         } else {

    //             var name = fname;
    //             var path = req.file.originalname;

    //             console.log(req);
    //             var newVideoGallery = {
    //                 name: name,
    //                 path: path
    //             };
    //Create a new image and save to db
    //     Videogallary.create(newVideoGallery, function (err, newlyCreated) {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             Videogallary.find({}, function (err, allVideoGallery) {
    //                 res.render('upload', { gallery: allVideoGallery });
    //             });
    //         }
    //     });
    // }
    // }
    // });
});


app.listen(3000, function (req, res) {
    console.log("SERVER HAS STARTED");
});