const { getFirestore, collection, setDoc, doc } = require("firebase/firestore");

const db = getFirestore();

async function setStartTime(task, uid) {
    try {
        const tasksDocRef = doc(db, "Tasks", uid);
        const tasksColRef = collection(tasksDocRef, "Tasks")
        await setDoc(doc(tasksColRef, task.id), {
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