const { getFirestore, collection, addDoc, doc } = require("firebase/firestore");

const db = getFirestore();

async function createJob(job, uid) {
    try {
        const jobsDocRef = doc(db, "Jobs", uid);
        const jobsColRef = collection(jobsDocRef, "Jobs")
        await addDoc(jobsColRef, {
            title: job.title,
            timeManagement: job.timeManagement,
            due: job.due,
            timeToComplete: job.timeToComplete,
            priority: job.priority,
            completed: false
        });

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

module.exports = createJob;