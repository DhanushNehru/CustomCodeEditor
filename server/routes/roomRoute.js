const router=require('express').Router();
const {createRoom,joinRoom,getAllRoom,getRoomById}=require('../controllers/roomController')
router.post('/createroom',createRoom);
router.post('/joinroom',joinRoom);
router.get('/allrooms',getAllRoom);
router.get('/getroombyid',getRoomById)
module.exports=router;