const express = require('express');
const bodyParser = require('body-parser');

const authenticate_token = require('../../middleware/authenticate_token.js');

const tasks_router = express.Router();
tasks_router.use(bodyParser.json());

const tasksApiController = require('./tasksApiController');

tasks_router.post('/tasks/createtask', authenticate_token, tasksApiController['createTask']);
tasks_router.post('/tasks/deletetask', authenticate_token, tasksApiController['deleteTask']);
tasks_router.post('/tasks/edittask', authenticate_token, tasksApiController['editTask']);
tasks_router.post('/tasks/markcompleted', authenticate_token, tasksApiController['markCompleted']);

module.exports = tasks_router;