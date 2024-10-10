const mongoose=require('mongoose');
const CodeSchema=mongoose.Schema({
    language:{
        type:String,
        required:true
    },
    code:{
        type:String,
    },
    room:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Room'
    }
},{timestamps:true})

const Code=mongoose.model('Code',CodeSchema);

module.exports=Code;
