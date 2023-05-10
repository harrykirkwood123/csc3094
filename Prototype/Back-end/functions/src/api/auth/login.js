const { firebase } = require('firebase/app')
const { getAuth, signInWithEmailAndPassword, getIdToken } = require('firebase/auth')
const admin = require('firebase-admin');

const auth = getAuth(firebase);

const serviceAccount = require("../../prototype.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://adhd-prototype.firebaseio.com"
});

async function loginAccount(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        const customToken = await getIdToken(auth.currentUser);
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
