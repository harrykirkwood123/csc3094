<template>
  <ion-page>
    <progress-chart></progress-chart>
  </ion-page>
</template>

<script>
import { defineComponent } from "vue";
import { IonPage } from "@ionic/vue";
import ProgressChart from "@/components/progress/ProgressChart.vue";
export default defineComponent ({
  name: "ProgressTab",
  components: {
    IonPage,
    ProgressChart
  }
})
</script>

<style scoped>

</style>