const { getFirestore, setDoc, doc } = require("firebase/firestore");

const db = getFirestore();

async function setGoal(body, uid) {
    try {
        const preferencesDocRef = doc(db, "UserPreferences", uid);
        console.log(body)
        await setDoc(preferencesDocRef, {
            goal: body.goal
        }, {
            merge: true
        });

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

module.exports = setGoal;