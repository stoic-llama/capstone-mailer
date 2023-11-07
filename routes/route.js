const router = require('express').Router();

const { sendStatus } = require('../controller/appController.js')


/** HTTP Reqeust */
router.post('/sendStatus', sendStatus);


module.exports = router;