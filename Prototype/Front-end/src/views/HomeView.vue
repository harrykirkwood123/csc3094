<template>
  <ion-page>
    <ion-tabs ref="tabRoot">
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="progress" href="/progress" selected>
          <ion-icon :icon="analyticsOutline"></ion-icon>
          <ion-label>Progress</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="planner" href="/planner" selected>
          <ion-icon :icon="calendarNumberOutline"></ion-icon>
          <ion-label>Planner</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tasks" href="/tasks" selected>
          <ion-icon :icon="readerOutline"></ion-icon>
          <ion-label>Tasks</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="timer" href="/timer" selected>
          <ion-icon :icon="timerOutline"></ion-icon>
          <ion-label>Timer</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="settings" href="/settings" selected>
          <ion-icon :icon="cogOutline"></ion-icon>
          <ion-label>Settings</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script>
import { IonPage, IonTabBar, IonTabs, IonTabButton, IonLabel, IonIcon, IonRouterOutlet } from '@ionic/vue';
import { readerOutline, timerOutline, cogOutline, analyticsOutline, calendarNumberOutline } from 'ionicons/icons';
import useState from "@/hooks/dataStore";
import { defineComponent } from 'vue';

export default defineComponent( {
  name: "HomeView",
  components: {
    IonPage,
    IonLabel,
    IonIcon,
    IonTabButton,
    IonTabs,
    IonTabBar,
    IonRouterOutlet
  },
  setup() {
    const { setUser } = useState()

    setUser()

    return {
      readerOutline,
      timerOutline,
      cogOutline,
      analyticsOutline,
      calendarNumberOutline
    }
  }
});
</script>

<style scoped>

</style>