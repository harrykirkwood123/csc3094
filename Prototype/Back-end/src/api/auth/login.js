const { firebase } = require('firebase/app')
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth')
const admin = require('firebase-admin');

const auth = getAuth(firebase);

const serviceAccount = require("../../prototype.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://adhd-prototype.firebaseio.com"
});


/**
 * Login.
 *
 * @author Andreas Kyratzis
 *
 * @module auth
 * @memberOf module:auth
 *
 * @param {String} email - The user's email
 * @param {String} password - The user's password
 * @returns {Promise} - Resolves into custom token if login successful or rejects into error
 */
// function loginAccount(email, password) {
//     return new Promise((resolve, reject) => {
//         signInWithEmailAndPassword(auth, email, password).then(cred => {
//             admin
//                 .auth()
//                 .createCustomToken(cred.user.uid)
//                 .then((customToken) => {
//                     resolve(customToken)
//                 })
//                 .catch((error) => {
//                     reject("Error logging in: " + error)
//                 });
//         }).catch(function(error) {
//             // Handle Errors here.
//             let errorCode = error.code;
//             let errorMessage = error.message;
//             if (errorCode === 'auth/wrong-password') {
//                 reject('Wrong password.');
//             } else {
//                 reject(errorMessage);
//             }
//         });
//     })
// }

async function loginAccount(email, password) {
    try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const customToken = await admin.auth().createCustomToken(cred.user.uid);
        return customToken;
    } catch (error) {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
            throw new Error('Wrong password.');
        } else {
            throw new Error('Error logging in: ' + errorMessage);
        }
    }
}


module.exports = loginAccount;
