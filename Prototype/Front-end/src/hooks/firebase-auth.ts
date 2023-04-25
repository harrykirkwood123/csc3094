import { toRefs, reactive } from "vue";
import { getApps, initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

import FIREBASE_CONFIG from "@/firebaseConfig";

// initialize firebase, this is directly from the firebase documentation
// regarding getting started for the web


if (getApps().length < 1) {
    initializeApp(FIREBASE_CONFIG);
    // Initialize other firebase products here
}

const state = reactive<{ user: any; initialized: boolean; error: any }>({
    user: null,
    initialized: false,
    error: null,
});

export default function() {
    // Signs the user out.
    const logout = () => {
        const auth = getAuth();

        return signOut(auth)
            .then(() => {
                state.user = null;
            });
    };

    const authCheck = () => {
        // Used to check whether a user is currently signed in. This is used by the router to determine
        // whether a user is allowed to access pages depending on whether they are authenticated
        const auth = getAuth();


        return new Promise((resolve) => {
            !state.initialized &&
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    state.user = user;
                } else {
                    state.user = null;
                }
                state.initialized = true;
                resolve(true);
            });
        });
    };

    return {
        ...toRefs(state),
        logout,
        authCheck,
    };
}
