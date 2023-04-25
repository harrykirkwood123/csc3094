<template>
  <ion-page>
    <ion-button expand="block" @click="signOut()">
      Sign Out
    </ion-button>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IonPage, IonButton, loadingController } from "@ionic/vue";
import useFirebaseAuth from "@/hooks/firebase-auth";
import { useRouter } from "vue-router";
export default defineComponent ({
  name: "SettingsTab",
  components: {
    IonPage,
    IonButton,

  },
  setup() {
    const {logout} = useFirebaseAuth();
    const router = useRouter();

    const signOut = async () => {
      const loading = await loadingController
          .create({
            message: 'Signing Out...',
            duration: 1000,
          });

      await loading.present();

      setTimeout(function() {
        loading.dismiss()
      }, 1000);

      await router.replace({path: "/login"})
      await logout();
      await location.reload();

    };

    return {
      signOut
    }
  }
})
</script>

<style scoped>

</style>