const express = require('express');
const bodyParser = require('body-parser');

const auth_router = express.Router();
auth_router.use(bodyParser.json());

const authApiController = require('./authApiController');



auth_router.post('/auth/login', authApiController['loginAccount']);
auth_router.get('/auth/logout', authApiController['logoutAccount']);
auth_router.post('/auth/createaccount', authApiController['createAccount']);


module.exports = auth_router;