const mongoose = require("mongoose");

const ListSchemas = new mongoose.Schema({
    title: { 
        type: String, 
        required: true, 
        unique: true 
    },
    type:{
        type:String,
    },
    genre:{
        type:String,
    },
    isSeries:{
        type:Boolean,
        default:false
    },
    content:{
        type:Array
    }
},{timestamps:true})


module.exports = mongoose.model("List",ListSchemas)