const express = require('express');
const router = express.Router();

const chatboxController = require('../app/controller/ChatBoxController');

router.get('/', chatboxController.showChatBox);
router.post('/', chatboxController.chatboxReply);





module.exports = router;