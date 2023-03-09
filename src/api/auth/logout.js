const { firebase } = require('firebase/app');
const { getAuth, signOut } = require('firebase/auth');

var auth = getAuth(firebase);

/**
 * Logout.
 *
 * @author Andreas Kyratzis
 *
 * @module auth
 * @memberOf module:auth
 *
 * @returns {Promise} - Promise object represents confirmation message
 */
function logoutAccount() {
    return new Promise((resolve, reject) => {
        signOut(auth).then(() => {
            resolve("Sign out successful.")
        }).catch(err => {
            reject(err)
        });
    })
}
module.exports = logoutAccount