const { getFirestore, collection, setDoc, doc } = require("firebase/firestore");

const db = getFirestore();

async function markCompleted(job, uid) {
    try {
        const jobsDocRef = doc(db, "Jobs", uid);
        const jobsColRef = collection(jobsDocRef, "Jobs")
        await setDoc(doc(jobsColRef, job.id), {
            completed: true
        }, {
            merge: true
        });

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

module.exports = markCompleted;