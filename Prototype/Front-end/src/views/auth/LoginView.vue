<template>
  <ion-page>
    <ion-content fullscreen class="ion-padding" scroll-x="false" scroll-y="false">
      <div class="container" style="top: 20%;">
        <img src="../../assets/Logo.png" class="logo">
      </div>
      <div class="container ion-padding-horizontal" style="top: 50%;">
        <ion-item fill="outline" mode="md" style="min-width: 80%; padding-bottom: 20px;">
          <ion-input label="email" label-placement="floating" placeholder="email" v-model="payload.email"></ion-input>
        </ion-item>
        <ion-item fill="outline" mode="md" style="min-width: 80%; padding-bottom: 20px;">
          <ion-input label="password"
                     type="password"
                     label-placement="floating"
                     placeholder="password"
                     v-model="payload.password">
          </ion-input>
        </ion-item>
      </div>
    </ion-content>

    <ion-footer class="ion-no-border ion-padding-bottom" translucent="true">
      <div>
        <ion-button expand="block"
                    class="ion-padding-horizontal"
                    size="large"
                    style="color: white; --border-radius: 20px; font-size: 25px;"
                    @click="doLogin">login
        </ion-button>
        <br>
        <ion-button expand="block"
                    class="ion-padding-horizontal"
                    size="large"
                    style="color: white; --border-radius: 20px; font-size: 25px; --background: #02C39A;"
                    @click="signUp()">create account
        </ion-button>
      </div>
    </ion-footer>
  </ion-page>
</template>

<script>
import { defineComponent, reactive } from 'vue'
import { useIonRouter } from '@ionic/vue';
import { IonPage, IonContent, IonInput, IonItem, IonButton, IonFooter, loadingController } from '@ionic/vue';
import api from "@/api/api";
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export default defineComponent ({
  name: "LoginView",
  setup() {
    const ionRouter = useIonRouter();

    const payload = reactive({
      email : "harrykirkwood123@gmail.com",
      password : "password"
    })

    const doLogin = async () => {
      await Haptics.impact({ style: ImpactStyle.Heavy });
      const { login } = api();

      const loading = await loadingController
          .create({
            message: 'Logging in...',
            duration: 1000,
          });

      await loading.present();

      setTimeout(function() {
        loading.dismiss()
      }, 1000);

      await login(payload).then(async () => {
        await ionRouter.replace("/tasks")
      })

    }

    // Route the user to the signup page
    const signUp = async () => {
      await Haptics.impact({ style: ImpactStyle.Heavy });
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
