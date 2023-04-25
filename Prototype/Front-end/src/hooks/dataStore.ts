import { reactive, toRefs } from "vue";
import { getAuth } from "firebase/auth"
import { getFirestore, doc, getDoc } from "firebase/firestore"

const state = reactive({
    user: null
});

export default function useState() {

    // Sets the global user object to the current user. Used to quickly obtain information about the current user.
    const setUser = async () => {
        const db = getFirestore()
        const auth = getAuth();
        const userRef = doc(db, "AccountInformation", auth.currentUser.uid);
        // const userRef = collection("AccountInformation").doc(firebase.auth().currentUser.uid)
        const user = await getDoc(userRef)
        state.user = user.data()
    }

    return {
        ...toRefs(state),
        setUser
    }
}
