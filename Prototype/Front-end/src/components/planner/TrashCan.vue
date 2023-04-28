<template>
  <ion-fab style="padding-bottom: 55px" slot="fixed" vertical="bottom" horizontal="end">
    <ion-fab-button>
      <ion-icon :icon="trashBin"></ion-icon>
    </ion-fab-button>
  </ion-fab>
</template>


<script>
import { IonFab, IonFabButton, IonIcon } from '@ionic/vue';
import { trashBin } from 'ionicons/icons';
import { defineComponent } from "vue";

export default defineComponent({
  name: "TrashCan",
  components: {
    IonFab,
    IonFabButton,
    IonIcon
  },
  setup() {
    return { trashBin }
  }
})
</script>

<style scoped>

</style>