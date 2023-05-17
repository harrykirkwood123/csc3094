<template>
  <ion-page>
    <ion-content scroll-y="false">
      <TimerComponent :task="task"></TimerComponent>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from "vue";
import { IonPage, IonContent } from "@ionic/vue";
import TimerComponent from "@/components/timer/TimerComponent.vue";
export default defineComponent ({
  name: "TimerTab",
  props: {
    task: Object
  },
  components: {
    IonPage,
    IonContent,
    TimerComponent
  }
})
</script>