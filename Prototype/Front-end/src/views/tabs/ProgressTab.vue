<template>
  <ion-page>
    <progress-chart></progress-chart>
    <hours-worked></hours-worked>
  </ion-page>
</template>

<script>
import {defineComponent} from "vue";
import { IonPage } from "@ionic/vue";
import ProgressChart from "@/components/progress/ProgressChart.vue";
import HoursWorked from "@/components/progress/HoursWorked.vue";
export default defineComponent ({
  name: "ProgressTab",
  components: {
    IonPage,
    ProgressChart,
    HoursWorked
  },
})
</script>
