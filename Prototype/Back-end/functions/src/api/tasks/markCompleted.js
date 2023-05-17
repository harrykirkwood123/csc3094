const { getFirestore, collection, setDoc, doc, serverTimestamp } = require("firebase/firestore");

const db = getFirestore();

async function markCompleted(task, uid) {
    try {
        const tasksDocRef = doc(db, "Tasks", uid);
        const tasksColRef = collection(tasksDocRef, "Tasks")
        await setDoc(doc(tasksColRef, task.id), {
            completed: true,
            completedTime: serverTimestamp(),
            startTime: null
        }, {
            merge: true
        });

    } catch (error) {
        throw new Error(error);
    }
}

module.exports = markCompleted;