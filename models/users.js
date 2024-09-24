const mongoose =require("mongoose");

const adminSchema = mongoose.Schema({ 
    username : {
        type : String,
         require: true,
  },
   email : {
        type : String,
         require: true,
    },
    password : {
        type : String,
        require: true
    },
    firstName : {
        type : String,
        require: true
    },
    lastName : {
        type : String,
        require: true
    },
    Projectname : {
        type : String,
        require: true
    },
    description : {
        type : String,
        require: true
    },
    type : {
        type : String,
        require: true
    },
    role:{
        type : String,
        require: true
    },
    status:{
        type : String,
        require: true
    }
})

const User = mongoose.model('User', adminSchema);
module.exports = User;