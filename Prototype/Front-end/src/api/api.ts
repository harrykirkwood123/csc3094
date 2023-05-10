import axios from "axios";
import { toastController } from "@ionic/vue";
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword, initializeAuth, indexedDBLocalPersistence, getIdToken } from "firebase/auth";
import { Capacitor } from '@capacitor/core';

import FIREBASE_CONFIG from "@/firebaseConfig";
import { initializeApp } from "firebase/app";

// Declaring the port and host address
const port = 8000
// const host = "http://127.0.0.1:" + port
const host = "https://adhd-prototype.web.app"

const app = initializeApp(FIREBASE_CONFIG);

if (Capacitor.isNativePlatform) {
    initializeAuth(app, {
        persistence: indexedDBLocalPersistence
    });
}
export const auth = getAuth(app);

// Declaring the api module
export default function api() {

    // Error handler used to display toast messages with an error if there is a catch
    const errorHandler = async (e) => {
        const toast = await toastController
            .create({
                message: e.response.data,
                duration: 2000,
                color: 'light',
                position: 'top'
            })
        return toast.present();
    }

    // Response handler used to display toast message if api call is successful / if there is an error
    const responseHandler = async (r, okay) => {
        if (r.status === 200) {
            const toast = await toastController
                .create({
                    message: okay,
                    duration: 2000,
                    color: 'dark',
                    position: 'top'
                })
            return toast.present();
        } else {
            const toast = await toastController
                .create({
                    message: "Oops an error has occurred!",
                    duration: 2000,
                    color: 'dark',
                    position: 'top'
                })
            return toast.present();
        }
    }

    function getCurrentUser() {
        return new Promise((resolve, reject) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                unsubscribe();
                resolve(user);
            }, reject);
        });
    }

    // login method uses firebase to sign in with the provided email & password
    const login = async (payload) => {
       const auth = getAuth(app);
        try {
            await signInWithEmailAndPassword(auth, payload.email, payload.password).then(async r => {
                r["status"] = 200
                await responseHandler(r,"Logged in successfully")
            })
        }
        catch (e) {
            e["status"] = 200
            await responseHandler(e, e.message)
        }
    }

    const logout = async () => {
        const auth = getAuth(app);
        try {
            await signOut(auth).then(async () => {
                const r = {};
                r["status"] = 200
                await responseHandler(r,"Logged out successfully")
            })
        }
        catch (e) {
            e["status"] = 200
            await responseHandler(e, e.message)
        }
    }

    // signUp method calls backend register method then calls login to sign the user in with the new account
    const signUp = async (payload) => {
        try {
            await axios.post(host + '/auth/register/', payload).then(async () => {
                await login(payload)
            })
        }
        catch (e) {
            await errorHandler(e)
        }
    }

    const createTask = async (payload) => {
        const auth = getAuth(app);
        const token = await getIdToken(auth.currentUser)

        try {
            await axios.post(host + '/tasks/createtask/', payload, {headers:
                    { authorization: `Bearer ${token}` }}).then(async (r) => {
                await responseHandler(r, "Task Created")
            })
        }
        catch (e) {
            await errorHandler(e)
        }
    }

    const deleteTask = async (payload) => {
        const auth = getAuth(app);
        const token = await getIdToken(auth.currentUser)

        try {
            await axios.post(host + '/tasks/deletetask/', payload, {headers:
                    { authorization: `Bearer ${token}` }}).then(async (r) => {
                await responseHandler(r, "Task Deleted")
            })
        }
        catch (e) {
            await errorHandler(e)
        }
    }

    const setStartTime = async (payload) => {
        const auth = getAuth(app);
        const token = await getIdToken(auth.currentUser)

        try {
            await axios.post(host + '/planner/setstarttime/', payload, {headers:
                    { authorization: `Bearer ${token}` }})
        }
        catch (e) {
            await errorHandler(e)
        }
    }

    const removeStartTime = async (payload) => {
        const auth = getAuth(app);
        const token = await getIdToken(auth.currentUser)

        try {
            await axios.post(host + '/planner/removestarttime/', payload, {headers:
                    { authorization: `Bearer ${token}` }})
        }
        catch (e) {
            await errorHandler(e)
        }
    }

    const markCompleted = async (payload) => {
        const auth = getAuth(app);
        const token = await getIdToken(auth.currentUser)

        try {
            await axios.post(host + '/tasks/markcompleted/', payload, {headers:
                    { authorization: `Bearer ${token}` }}).then(async (r) => {
                await responseHandler(r, "Task Completed")
            })
        }
        catch (e) {
            await errorHandler(e)
        }
    }


    return {
        signUp,
        login,
        logout,
        createTask,
        deleteTask,
        setStartTime,
        removeStartTime,
        markCompleted,
        getCurrentUser
    }
}
