const { getFirestore, setDoc, doc } = require("firebase/firestore");

const db = getFirestore();

async function setGoal(body, uid) {
    try {
        const preferencesDocRef = doc(db, "UserPreferences", uid);
        await setDoc(preferencesDocRef, {
            goal: body.goal
        }, {
            merge: true
        });

    } catch (error) {
        throw new Error(error);
    }
}

module.exports = setGoal;