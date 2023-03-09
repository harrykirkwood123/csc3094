const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initializeApp } = require('firebase/app');

// firebase configuration settings
const firebaseConfig = {
    apiKey: "AIzaSyAFtFYOD1pPtwSrfxzzX4lybyTfM2he3mY",
    authDomain: "adhd-prototype.firebaseapp.com",
    projectId: "adhd-prototype",
    storageBucket: "adhd-prototype.appspot.com",
    messagingSenderId: "677433061194",
    appId: "1:677433061194:web:a8564698cf520107519bb3",
    measurementId: "G-5F279PRTVB"
};

initializeApp(firebaseConfig);

const app = express();

app.use(cors());

const auth_router = require('./src/controllers/auth/authRouter')

app.use('/', auth_router)

app.use(bodyParser.json());

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log('Listening on: ', port);
});

