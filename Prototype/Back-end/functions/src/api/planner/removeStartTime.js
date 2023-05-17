const { getFirestore, collection, setDoc, doc } = require("firebase/firestore");

const db = getFirestore();

async function removeStartTime(task, uid) {
    try {
        const tasksDbRef = collection(db, "Tasks", uid, "Tasks")
        await setDoc(doc(tasksDbRef, task.id), {
            startTime: null
        }, {
            merge: true
        });

    } catch (error) {
        throw new Error(error);
    }
}

module.exports = removeStartTime;