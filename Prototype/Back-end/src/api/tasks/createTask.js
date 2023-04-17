const { getFirestore, collection, addDoc, doc } = require("firebase/firestore");

const db = getFirestore();

async function createTask(task, uid) {
    try {
        const tasksDocRef = doc(db, "Tasks", uid);
        const tasksColRef = collection(tasksDocRef, "Tasks")
        await addDoc(tasksColRef, {
            title: task.title,
            timeManagement: task.timeManagement,
            due: task.due,
            timeToComplete: task.timeToComplete,
            priority: task.priority,
            completed: false
        });

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

module.exports = createTask;