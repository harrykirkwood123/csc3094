const loginAccountApi = require('../../api/auth/login');
const logoutAccountApi = require('../../api/auth/logout');
const createAccountApi = require('../../api/auth/newUser');

class AuthApiController {

    /**
     * Create an account.<br>
     * PATH: /auth/register<br>
     * METHOD: POST<br>
     *
     * @param {Request} req - HTTP request
     * @param {String} req.body.email - The payee's email
     * @param {String} req.body.password - The payee's password
     * @param {String} req.body.firstName - The payee's first name
     * @param {String} req.body.lastName - The payee's last name
     * @param {String} req.body.DoB - The payee's sort code
     * @param {String} req.body.university - The payee's account number
     * @param {String} req.body.address - The payee's account number
     * @param {String} req.body.phone - The payee's account number
     * @param {Response} res - HTTP response
     *
     * @apiType POST
     * @apiPath /auth/register
     * @apiBody {"email": "String","password": "String","firstName":"String","lastName":"String","DoB": "String","university": "String","address": "String",
     * "phone": "String"}
     * @apiKey Register
     * @apiDescription Create an account
     * @apiResponse String
     */
    createAccount(req, res) {
        createAccountApi(req.body)
            .then(uid => {
                res.status(200).send(uid)
            })
            .catch(err => {
                res.status(400).send(err)
            })
    }

    /**
     * Log in.<br>
     * PATH: /auth/login<br>
     * METHOD: POST<br>
     * Note: This method isn't being used by the front end, it's only use is for backend testing.
     *
     * @param {Request} req - HTTP request
     * @param {String} req.body.email - The user's email
     * @param {String} req.body.password - The user's password
     * @param {Response} res - HTTP response
     *
     * @apiType POST
     * @apiPath /auth/login
     * @apiKey Login
     * @apiDescription Log in to account
     * @apiResponse CustomToken
     */
    loginAccount(req, res) {
        let email = req.body.email
        let password = req.body.password
        loginAccountApi(email, password)
            .then(token => {
                res.status(200).send(token)
            })
            .catch(err => {
                res.status(400).send(err)
            })
    }

    /**
     * Log out of currently signed in account. <br>
     * PATH: /auth/logout <br>
     * METHOD: GET
     *
     * @param {Request} req - HTTP request
     * @param {Response} res - HTTP response
     *
     * @apiType GET
     * @apiPath /auth/logout
     * @apiKey Logout
     * @apiDescription Log out of currently signed in account
     * @apiResponse String
     */
    logoutAccount(req, res) {
        logoutAccountApi()
            .then(message => {
                res.status(200).send(message)
            })
            .catch(err => {
                res.status(400).send(err)
            })
    }
}

module.exports = new AuthApiController()