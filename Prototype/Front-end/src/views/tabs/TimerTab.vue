<template>
  <ion-page>
    <ion-content scroll-y="false">
      <TimerComponent :task="task"></TimerComponent>
<!--      <ion-grid>-->
<!--        <ion-row class="ion-justify-content-center">-->
<!--          <ion-col>-->
<!--          </ion-col>-->
<!--          <ion-col>-->

<!--          </ion-col>-->
<!--          <ion-col>-->
<!--          </ion-col>-->
<!--        </ion-row>-->
<!--      </ion-grid>-->
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
    // IonGrid,
    // IonRow,
    // IonCol,
    IonContent,
    TimerComponent
  }
})
</script>

<style scoped>

</style>