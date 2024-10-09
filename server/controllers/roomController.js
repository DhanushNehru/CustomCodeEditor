const Room = require('../models/Room');

const createRoom = async (req, res) => {
    const { roomName } = req.body;
    if (!roomName ) return res.status(400).json({ msg: "Enter all Fields" });
    try {
        // add the user who has created this room automatically
       // const user = req.user;
        const newRoom = await Room.create({ roomName })
        return res.status(200).json({ newRoom })
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Error in creating room" });
    }
}

const joinRoom = async (req, res) => {
    const { roomId } = req.body;
    try {
        //const user = req.user;
        const room = await Room.findById({ _id: roomId })
        if (!room) return res.status(404).json({ msg: "Room not found" });

        return res.status(200).json({ room });
    } catch (err) {
        console.log(err);
        res.status(400).json({ msg: "Error in joining room" });
    }
}

const getAllRoom=async(req,res)=>{
    try {
        const rooms = await Room.find({}).sort({ createdAt: -1 });;
        return res.status(200).json({ rooms });
    } catch (err) {
        console.log(err);
        res.status(400).json({ msg: "Error in getting all rooms" });
    }
}

const getRoomById=async(req,res)=>{
    try{    
        const {id,language}=req.query
        const room=await Room.findOne({_id:id,language:language});
        if(!room) return res.status(404).json({ msg: "Room not found" });
        return res.status(200).json({ room });
    }catch(err){
        console.log(err);
        res.status(400).json({ msg: "Error in getting room by id" });
    }
}


module.exports = { joinRoom, createRoom,getAllRoom,getRoomById }
