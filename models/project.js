var mongoose = require("mongoose");

var projectSchema = new mongoose.Schema({
    projectFile :File,
    projectTitle : String,
    projectDescription : String,
    createdBy : {
        id:{
        type : mongoose.Schema.Types.ObjectId,
        ref: "User" 
        },
        username : String
    },
    sharedTo : [{
        type : mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
});

module.exports = mongoose.model("Project",projectSchema);