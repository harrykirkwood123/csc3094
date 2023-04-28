<template>
  <v-cupertino id="1" :drawerOptions="options" ref="bottomSheet">
    <div>
      <ion-list>
        <ion-item>
          <ion-input placeholder="title" v-model="payload.title"></ion-input>
        </ion-item>

        <ion-item>
          <ion-input placeholder="priority" v-model="payload.priority"></ion-input>
        </ion-item>

        <ion-item>
          <ion-input placeholder="duration" v-model="payload.duration"></ion-input>
        </ion-item>
      </ion-list>

      <ion-button expand="block" slot="bottom" @click="callCreateTask">Submit</ion-button>
    </div>
  </v-cupertino>
</template>

<script lang="ts">
import { IonList, IonItem, IonInput, IonButton } from "@ionic/vue";
import { defineComponent, ref, Ref } from "vue";
import api from "@/api/api";
import VCupertino from "v-cupertino";
import { CupertinoPane } from "cupertino-pane";

export default defineComponent ({
  name: "CreateTask",
  components: {
    VCupertino,
    IonList,
    IonItem,
    IonInput,
    IonButton
  },
  data() {
    return {
      payload: {
        title: "",
        priority: "",
        duration: ""
      }
    }
  },
  methods: {
    async callCreateTask() {
      const { createTask } = api();

      await createTask(this.payload)
      this.destroyDrawer()
    }
  },
  setup() {
    const bottomSheet: Ref<typeof VCupertino> = ref(VCupertino);

    const destroyDrawer = () => {
      const cupertino = bottomSheet.value.cupertino as CupertinoPane;
      cupertino.moveToBreak("middle");
    }

    const options = {
      topperOverflow: true,
      draggableOver: false,
      preventClicks: false,
      preventScroll: true,
      topperOverflowOffset: 60,
      buttonClose: false,
      bottomClose: false,
      lowerThanBottom: false,
      initialBreak: "middle",
      breaks: {
        top: {
          enabled: true,
          height: 680,
          bounce: true
        },
        middle: {
          enabled: true,
          height: 100,
          bounce: true
        },
        bottom: {
          enabled: false
        }
      }
    }

    return {
      options,
      bottomSheet,
      destroyDrawer
    }

  }
})

</script>

<style scoped>

</style>