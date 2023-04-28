const setStartTimeApi = require('../../api/planner/setStartTime');
const removeStartTimeApi = require('../../api/planner/removeStartTime');

class PlannerApiController {
    setStartTime(req, res) {
        setStartTimeApi(req.body, req.authId)
            .then(uid => {
                res.status(200).send(uid)
            })
            .catch(err => {
                res.status(400).send(err)
            })
    }

    removeStartTime(req, res) {
        removeStartTimeApi(req.body, req.authId)
            .then(uid => {
                res.status(200).send(uid)
            })
            .catch(err => {
                res.status(400).send(err)
            })
    }
}

module.exports = new PlannerApiController()