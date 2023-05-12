<template>
  <ion-page>
    <ion-content scroll-y="false">
      <ion-list>
        <ion-item>
          <ion-button size="large" expand="block" @click="signOut()">
            Sign Out
          </ion-button>
        </ion-item>
        <ion-item @touchstart="$emit('lockSlide')" @touchend="$emit('unlockSlide')">
          <ion-range @ionChange="callSetGoal" :pin="true" debounce="1000" :max="60" :min="5" :value="payload.goal" label-placement="fixed">
            <div slot="label">Tasks Goal</div>
          </ion-range>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IonPage, IonButton, loadingController, IonRange, IonList, IonItem, IonContent } from "@ionic/vue";
import api from "@/api/api";
import { useRouter } from "vue-router";
const { logout, setGoal } = api();
export default defineComponent ({
  name: "SettingsTab",
  data () {
    return {
      payload: {
        goal: 40
      }
    }
  },
  components: {
    IonPage,
    IonButton,
    IonRange,
    IonList,
    IonItem,
    IonContent
  },
  methods: {
    async callSetGoal({ detail }) {
      this.payload.goal = detail.value
      console.log(this.payload)
      await setGoal(this.payload)
    }
  },
  setup() {

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

      await logout();
      await router.replace({path: "/login"})
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