<template>
  <v-cupertino id="1" :drawerOptions="options" ref="bottomSheet" @touchstart="$emit('disableDrag')" @touchend="$emit('enableDrag')">
    <div>
      <h1 style="padding-bottom: 40px"> create a task </h1>

    </div>
    <div>
      <ion-list style="display: flex; flex-direction: column; align-items: center;">
        <ion-item fill="outline" mode="md" style="min-width: 80%; padding-bottom: 20px;">
          <ion-input autocapitalize="on" label="title" type="text" label-placement="floating" placeholder="title" v-model="payload.title"></ion-input>
        </ion-item>

        <ion-item fill="outline" mode="md" style="min-width: 80%; padding-bottom: 20px;">
          <ion-input label="priority" :readonly="true"  @click="priorityPicker" label-placement="floating" placeholder="priority" v-model="payload.priority"></ion-input>
          <ion-picker
              :isOpen="pPicker"
              :columns="priorityOptions"
              :buttons="priorityButtons"
              @did-dismiss="pPicker = false"
          ></ion-picker>
        </ion-item>

        <ion-item fill="outline" mode="md" style="min-width: 80%; padding-bottom: 20px;">
          <ion-input id="duration" :readonly="true" @click="durationPicker" label="duration" placeholder="duration" v-model="displayedDuration"></ion-input>
          <ion-picker
              :isOpen="dPicker"
              :columns="durationOptions"
              :buttons="durationButtons"
              @did-dismiss="dPicker = false"
          ></ion-picker>
        </ion-item>

        <ion-button id="createtask" :disabled="valid" expand="block" style="min-width: 80%;" size="large" slot="bottom" @click="callCreateTask">Submit</ion-button>
        <ion-loading :is-open="loading" trigger="createtask" message="Creating task..."> </ion-loading>
      </ion-list>
    </div>
  </v-cupertino>
</template>

<script lang="ts">
import { IonList, IonItem, IonInput, IonButton, IonPicker, IonLoading } from "@ionic/vue";
import { defineComponent, ref, Ref } from "vue";
import api from "@/api/api";
import VCupertino from "v-cupertino";
import { CupertinoPane } from "cupertino-pane";
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export default defineComponent ({
  name: "CreateTask",
  components: {
    VCupertino,
    IonList,
    IonItem,
    IonInput,
    IonButton,
    IonPicker,
    IonLoading
  },
  data() {
    return {
      loading: false,
      dPicker: false,
      pPicker: false,
      displayedDuration: null,
      payload: {
        title: null,
        priority: null,
        duration: null
      },
      priorityOptions: [
        {
          name: 'priorities',
          options: [
            {
              text: 'Low',
              value: 'Low'
            },
            {
              text: 'Medium',
              value: 'Medium'
            },
            {
              text: 'High',
              value: 'High'
            }
          ]
        }
      ],
      priorityButtons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: (value) => {
            this.setPriority(value);
          }
        }
      ],
      durationOptions: [
        {
          name: 'hours',
          options: [
            {
              text: '0hr',
              value: 0
            },
            {
              text: '1hr',
              value: 3600
            },
            {
              text: '2hr',
              value: 7200
            },
            {
              text: '3hr',
              value: 10800
            },
            {
              text: '4hr',
              value: 14400
            }
          ]
        },
        {
        name: 'minutes',
        options: [
          {
            text: '0m',
            value: 0
          },
          {
            text: '15m',
            value: 900
          },
          {
            text: '30m',
            value: 1800
          },
          {
            text: '45m',
            value: 2700
          }
        ]
      }],
      durationButtons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: (value) => {
            this.setDuration(value);
          }
        }
      ]
    }
  },
  computed: {
    valid() {
      const payload = this.payload
      if (payload.title === null || payload.priority === null || payload.duration === null) {
        return true
      }

      if (payload.title === "" || payload.priority === "" || payload.duration === "") {
        return true
      }

      if (payload.duration === 0) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    async callCreateTask() {
      await Haptics.impact({ style: ImpactStyle.Heavy });
      this.loading = true;
      const { createTask } = api();

      await createTask(this.payload).then(() => {
        this.destroyDrawer();
        this.loading = false;
      })
      this.displayedDuration = null;
      this.payload = {
        title: null,
            priority: null,
            duration: null
      }


    },

    async durationPicker() {
      this.dPicker = true;
    },

    async priorityPicker() {
      this.pPicker = true;
    },

    async setDuration(value) {
      this.payload.duration = value.hours.value + value.minutes.value;
      this.displayedDuration = value.hours.text + " " + value.minutes.text;
    },

    async setPriority(value) {
      this.payload.priority = value.priorities.value;
    }
  },
  setup() {
    const bottomSheet: Ref<typeof VCupertino> = ref(VCupertino);

    const destroyDrawer = () => {
      const cupertino = bottomSheet.value.cupertino as CupertinoPane;
      cupertino.moveToBreak("bottom");
    }

    const showDrawer = () => {
      const cupertino = bottomSheet.value.cupertino as CupertinoPane;
      cupertino.moveToBreak("top");
    }

    const options = {
      animationDuration: 300,
      topperOverflow: true,
      draggableOver: false,
      preventClicks: true,
      preventScroll: false,
      topperOverflowOffset: 50,
      buttonClose: false,
      bottomClose: false,
      lowerThanBottom: false,
      clickBottomOpen: true,
      initialBreak: "bottom",
      breaks: {
        top: {
          enabled: true,
          height: 680,
          bounce: true
        },
        middle: {
          enabled: false
        },
        bottom: {
          enabled: true,
          height: 200,
          bounce: true
        }
      }
    }

    return {
      options,
      bottomSheet,
      destroyDrawer,
      showDrawer
    }

  }
})

</script>