const createJobApi = require('../../api/jobs/createJob');
const deleteJobApi = require('../../api/jobs/deleteJob');
const editJobApi = require('../../api/jobs/editJob');

class JobsApiController {
    createJob(req, res) {
        createJobApi(req.body, req.authId)
            .then(uid => {
                res.status(200).send(uid)
            })
            .catch(err => {
                res.status(400).send(err)
            })
    }

    deleteJob(req, res) {
        deleteJobApi(req.body.jobId, req.authId)
            .then(uid => {
                res.status(200).send(uid)
            })
            .catch(err => {
                res.status(400).send(err)
            })
    }

}

module.exports = new JobsApiController()