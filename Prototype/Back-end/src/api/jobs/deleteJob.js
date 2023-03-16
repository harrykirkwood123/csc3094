const { getFirestore, doc, setDoc } = require("firebase/firestore");

const db = getFirestore();

async function deleteJob(job) {
    try {
        await setDoc(doc(db, "Jobs", cred.user.uid), {
            title: job.title,
            timeManagement: job.timeManagement,
            due: job.due,
            timeToComplete: job.timeToComplete,
            priority: job.priority
        });

    } catch (error) {
        throw new Error(error);
    }
}

module.exports = deleteJob;