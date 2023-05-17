const { getFirestore, collection, addDoc } = require("firebase/firestore");
const { firebase } = require("firebase/app")

const db = getFirestore(firebase);

async function createTask(task, uid) {
    try {
        // Creating a reference to the specified user Tasks database.
        const tasksDbRef = collection(db, "Tasks", uid, "Tasks")
        await addDoc(tasksDbRef, {
            title: task.title,
            duration: parseInt(task.duration),
            priority: task.priority,
            completed: false
        });
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

module.exports = createTask;