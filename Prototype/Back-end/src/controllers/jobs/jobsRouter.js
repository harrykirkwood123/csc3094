const express = require('express');
const bodyParser = require('body-parser');

const authenticate_token = require('../../middleware/authenticate_token.js');

const jobs_router = express.Router();
jobs_router.use(bodyParser.json());

const jobsApiController = require('./jobsApiController');

jobs_router.post('/jobs/createjob', authenticate_token, jobsApiController['createJob']);
jobs_router.post('/jobs/deletejob', authenticate_token, jobsApiController['deleteJob']);
jobs_router.post('/jobs/editjob', authenticate_token, jobsApiController['editJob']);

module.exports = jobs_router;