import { toRefs, reactive } from "vue";
import { getApps, initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth";

import FIREBASE_CONFIG from "@/firebaseConfig";

// initialize firebase, this is directly from the firebase documentation
// regarding getting started for the web

// if (getApps().length < 1) {
//     app = initializeApp(FIREBASE_CONFIG);
//     // Initialize other firebase products here
// }

const app = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);

// const state = reactive<{ user: any; initialized: boolean; error: any }>({
//     user: null,
//     initialized: false,
//     error: null,
// });

export function getCurrentUser() {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        }, reject);
    });
}

// export async function login(username, password) {
//     await signInWithEmailAndPassword(auth, username, password)
//
//     console.log("HELLO")
// }

export async function logout() {
    await signOut(auth)
}

export default function() {
    const login = async (username, password) => {
        await signInWithEmailAndPassword(auth, username, password)

        console.log("HELLO")
    }

    return {
        login
    }

    // Signs the user out.
    // const logout = () => {
    //     const auth = getAuth();
    //
    //     return signOut(auth)
    //         .then(() => {
    //             state.user = null;
    //         });
    // };
    //
    // const authCheck = () => {
    //     // Used to check whether a user is currently signed in. This is used by the router to determine
    //     // whether a user is allowed to access pages depending on whether they are authenticated
    //     const auth = getAuth();
    //
    //
    //     return new Promise((resolve) => {
    //         !state.initialized &&
    //         onAuthStateChanged(auth, (user) => {
    //             if (user) {
    //                 state.user = user;
    //             } else {
    //                 state.user = null;
    //             }
    //             state.initialized = true;
    //             resolve(true);
    //         });
    //     });
    // };
    //
    // return {
    //     ...toRefs(state),
    //     logout,
    //     authCheck,
    // };
}
