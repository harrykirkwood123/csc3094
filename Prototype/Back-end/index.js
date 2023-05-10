const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initializeApp } = require('firebase/app');

const allowedOrigins = [
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost',
    'http://localhost:8080',
    'http://localhost:8100',
];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Origin not allowed by CORS'));
        }
    },
};

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
app.use(bodyParser.json());

const auth_router = require('./src/controllers/auth/authRouter')
const tasks_router = require('./src/controllers/tasks/tasksRouter')
const planner_router = require('./src/controllers/planner/plannerRouter')

app.use('/', auth_router, tasks_router, planner_router)

// const port = process.env.PORT || 8000;
// app.listen(port, () => {
//     console.log('Listening on: ', port);
// });

exports.app = functions.https.onRequest(app);

