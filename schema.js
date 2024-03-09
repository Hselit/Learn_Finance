const mongoose  = require("mongoose");

const schema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username:{ 
        type:String, required: true
    },
    email:{ 
        type:String, required: true
    },
    password:{
        type: String,required:true
    },
})
const collection = new mongoose.model('user',schema);
module.exports=collection;
