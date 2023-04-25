const { getFirestore, collection, addDoc, doc } = require("firebase/firestore");

const db = getFirestore();

async function createTask(task, uid) {
    try {
        // Creating a reference to the specified user Tasks database.
        const tasksDbRef = collection(db, "Tasks", uid, "Tasks")
        await addDoc(tasksDbRef, {
            title: task.title,
            duration: task.duration,
            priority: task.priority,
            dateStart: "",
            dateEnd: "",
            progress: 0,
            completed: false
        });
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

module.exports = createTask;