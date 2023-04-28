const express = require('express');
const bodyParser = require('body-parser');

const authenticate_token = require('../../middleware/authenticate_token.js');

const planner_router = express.Router();
planner_router.use(bodyParser.json());

const plannerApiController = require('./plannerApiController');

planner_router.post('/planner/setstarttime', authenticate_token, plannerApiController['setStartTime']);
planner_router.post('/planner/removestarttime', authenticate_token, plannerApiController['removeStartTime']);

module.exports = planner_router;