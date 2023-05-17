const { getFirestore, collection, setDoc, doc } = require("firebase/firestore");

const db = getFirestore();

async function setStartTime(task, uid) {
    try {
        const tasksDbRef = collection(db, "Tasks", uid, "Tasks")
        await setDoc(doc(tasksDbRef, task.id), {
            startTime: task.startTime
        }, {
            merge: true
        });

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

module.exports = setStartTime;