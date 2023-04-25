<template>
  <ion-page>
    <ion-content fullscreen class="ion-padding" scroll-x="false" scroll-y="false">
      <div class="container" style="top: 20%;">
        <img src="../../assets/Logo.png" class="logo">
      </div>
      <div class="container ion-padding-horizontal" style="top: 50%;">
        <ion-item>
          <ion-label position="floating">Email</ion-label>
          <ion-input label="email" label-placement="floating" fill="outline" type="email" v-model="payload.email"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Password</ion-label>
          <ion-input label="password" label-placement="floating" fill="outline" type="password" v-model="payload.password"></ion-input>
        </ion-item>
      </div>
    </ion-content>

    <ion-footer class="ion-no-border ion-padding-bottom" translucent="true">
      <div>
        <ion-button expand="block" class="ion-padding-horizontal" size="large" style="color: white; --border-radius: 20px; font-size: 25px;" @click="doLogin()">login</ion-button>
        <br>
        <ion-button expand="block" class="ion-padding-horizontal" size="large" style="color: white; --border-radius: 20px; font-size: 25px; --background: #02C39A;" @click="signUp()">create account</ion-button>
      </div>
    </ion-footer>
  </ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useRouter } from "vue-router"
import { IonPage, IonContent, IonInput, IonItem, IonButton, IonFooter, loadingController } from '@ionic/vue';
import api from "@/api/api";

export default defineComponent ({
  name: "LoginView",
  setup() {
    const { login } = api();

    const router = useRouter();

    const payload = ref({
      email : "",
      password : ""
    })

    // Handle login using the api module method
    const doLogin = async () => {

      const loading = await loadingController
          .create({
            message: 'Logging in...',
            duration: 1000,
          });

      await loading.present();

      setTimeout(function() {
        loading.dismiss()
      }, 1000);

      await login(payload.value)
      await router.push("/home")
    }

    // Route the user to the signup page
    const signUp = async () => {
      await router.replace("/signup")
    }

    // Show the getting started modal
    async function showModal() {
      // const modal = await modalController
      //     .create({
      //       component: GettingStartedModal,
      //       cssClass: 'modalStyle'
      //     })
      // return modal.present();

    }
    return {
      payload,
      signUp,
      doLogin
    }
  },
  components: {
    IonPage,
    IonContent,
    IonInput,
    IonItem,
    IonButton,
    IonFooter,

  }
})
</script>

<style>
.container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  transform: translateY(-50%);
}

.logo {
  width: 70%;
  max-width: 400px
}
</style>
