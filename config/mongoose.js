const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/PMS1');

const db = mongoose.connection;

db.once('open',(err)=>{
    if(err){
        console.log("be not connected",err);
        return false;
    }
    console.log('db is connected')
})