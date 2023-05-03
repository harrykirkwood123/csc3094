<template>
  <ion-page>
    <ion-content fullscreen scroll-y="false">
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
    task: {}
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
ion-grid {
  --ion-grid-column-padding: 70px;

}
</style>