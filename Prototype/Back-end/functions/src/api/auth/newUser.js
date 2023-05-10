const { firebase } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require("firebase/firestore");

const auth = getAuth(firebase);
const db = getFirestore();

async function createAccount(newUser) {
    try {
        const cred = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);

        await setDoc(doc(db, "AccountInformation", cred.user.uid), {
            firstName: newUser.firstName
        });

        await setDoc(doc(db, "UserPreferences", cred.user.uid), {
            darkMode: false
        });
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = createAccount;