const { getFirestore, collection, deleteDoc, doc } = require("firebase/firestore");

const db = getFirestore();

async function deleteJob(jobId, uid) {
    try {
        const jobsDocRef = doc(db, "Jobs", uid);
        const jobsColRef = collection(jobsDocRef, "Jobs")
        await deleteDoc(doc(jobsColRef, jobId));

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

module.exports = deleteJob;