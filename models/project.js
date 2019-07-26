var mongoose = require("mongoose");

var projectSchema = new mongoose.Schema({
    projectFileURL : String,
    projectTitle : String,
    projectDescription : String,
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User" 
    },
    sharedTo : [{
        type : mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
});

module.exports = mongoose.model("Project",projectSchema);