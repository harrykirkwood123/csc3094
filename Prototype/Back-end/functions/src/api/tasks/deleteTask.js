const { getFirestore, collection, deleteDoc, doc } = require("firebase/firestore");

const db = getFirestore();

async function deleteTask(task, uid) {
    try {
        const tasksDocRef = doc(db, "Tasks", uid);
        const tasksColRef = collection(tasksDocRef, "Tasks")
        await deleteDoc(doc(tasksColRef, task.id));

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

module.exports = deleteTask;