const router=require('express').Router();
const {getCode}=require('../controllers/codeController')
router.get('/getcode',getCode);
module.exports=router;