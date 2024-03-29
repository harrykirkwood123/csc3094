const admin = require('firebase-admin')

/**
 * Get authentication token from request headers.
 *
 * @author Harry Kirkwood
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
const getAuthToken = (req, res, next) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
        req.authToken = req.headers.authorization.split(' ')[1];
    } else {
        req.authToken = null;
    }
    next();
}

module.exports = (req, res, next) => {
    getAuthToken(req, res, async () => {
        try {
            const { authToken } = req;
            await admin.auth().verifyIdToken(authToken).then((decodedToken) => {
                const uid = decodedToken.uid;
                req.authId = uid
            })
            return next();
        } catch (e) {
            console.log(e)
            return res.status(401).send(
                {
                    error: 'You are not authorized to make this request'
                });
        }
    });
}