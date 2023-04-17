const { getFirestore, collection, setDoc, doc } = require("firebase/firestore");

const db = getFirestore();

async function editTask(task, uid) {
    try {
        const tasksDocRef = doc(db, "Tasks", uid);
        const tasksColRef = collection(tasksDocRef, "Tasks")
        await setDoc(doc(tasksColRef, task.id), {
            title: task.title,
            timeManagement: task.timeManagement,
            due: task.due,
            timeToComplete: task.timeToComplete,
            priority: task.priority
        });

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

module.exports = editTask;