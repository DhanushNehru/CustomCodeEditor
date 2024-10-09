const mongoose=require('mongoose');

const RoomSchema=mongoose.Schema({
    roomName:{
        type:String,
        required:true
    },
   
    
},{ timestamps: true })

const Room=mongoose.model('Room',RoomSchema);
module.exports= Room;