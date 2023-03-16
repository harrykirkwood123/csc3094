const { getFirestore, collection, setDoc, doc } = require("firebase/firestore");

const db = getFirestore();

async function editJob(job, uid) {
    try {
        const jobsDocRef = doc(db, "Jobs", uid);
        const jobsColRef = collection(jobsDocRef, "Jobs")
        await setDoc(doc(jobsColRef, job.id), {
            title: job.title,
            timeManagement: job.timeManagement,
            due: job.due,
            timeToComplete: job.timeToComplete,
            priority: job.priority
        });

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

module.exports = editJob;