import { createApp } from 'vue'
import App from './App.vue'
import router  from './router'
import {VueFire, VueFireAuth, VueFireFirestoreOptionsAPI } from 'vuefire'
import { firebaseApp } from './firebaseInit'

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

import 'swiper/css';
import '@ionic/vue/css/ionic-swiper.css';

//theme
import "primevue/resources/themes/lara-light-indigo/theme.css";

//core
import "primevue/resources/primevue.min.css";

/* Theme variables */
import './theme/variables.css';

// import useFirebaseAuth from "./hooks/firebase-auth";
import veProgress from "vue-ellipse-progress"
import PrimeVue from 'primevue/config';

// const { authCheck  } = useFirebaseAuth();

const app = createApp(App)
    .use(IonicVue)
    .use(router)
    .use(veProgress)
    .use(PrimeVue)
    .use(VueFire, {
    firebaseApp,
    modules: [
        VueFireAuth(),
        VueFireFirestoreOptionsAPI(),
    ],
})

router.isReady().then(() => {
    app.mount('#app');
});

// authCheck()
//     .then(() => {
//         app.use(router)
//         app.use(veProgress)
//         app.use(PrimeVue)
//         app.use(VueFire, {
//             firebaseApp,
//             modules: [
//               VueFireAuth(),
//               VueFireFirestoreOptionsAPI(),
//             ],
//         })
//         return router.isReady();
//     })
//     .then(() => {
//       app.mount("#app");
//     });