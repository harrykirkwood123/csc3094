const createTaskApi = require('../../api/tasks/createTask');
const deleteTaskApi = require('../../api/tasks/deleteTask');
const editTaskApi = require('../../api/tasks/editTask');
const markCompletedApi = require('../../api/tasks/markCompleted');

class TasksApiController {
    createTask(req, res) {
        createTaskApi(req.body, req.authId)
            .then(uid => {
                res.status(200).send(uid)
            })
            .catch(err => {
                res.status(400).send(err)
            })
    }

    deleteTask(req, res) {
        deleteTaskApi(req.body.jobId, req.authId)
            .then(uid => {
                res.status(200).send(uid)
            })
            .catch(err => {
                res.status(400).send(err)
            })
    }

    editTask(req, res) {
        editTaskApi(req.body, req.authId)
            .then(uid => {
                res.status(200).send(uid)
            })
            .catch(err => {
                res.status(400).send(err)
            })
    }

    markCompleted(req, res) {
        markCompletedApi(req.body, req.authId)
            .then(uid => {
                res.status(200).send(uid)
            })
            .catch(err => {
                res.status(400).send(err)
            })
    }

}

module.exports = new TasksApiController()