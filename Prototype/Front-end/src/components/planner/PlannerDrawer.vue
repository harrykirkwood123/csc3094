<template>
  <v-cupertino id="2" :drawerOptions="options" ref="plannerDrawer" @transitionend="getPosition" @touchstart="$emit('disableDrag')" @touchend="$emit('enableDrag')">
    <draggable ghost-class="ghostdrop"
               :list="tasks"
               group="tasks"
               itemKey="2"
               class="list-group"
               :component-data="{
                          tag: 'div',
                          name: 'flip-list',
                          type: 'transition',
                       }"
               v-bind="dragOptions"
               @start="handleDrag"
               @end="handleDrop"
               :move="checkFull">
      <template #item="{ element }">
        <ion-card v-if="element.startTime == null && element.completed !== true">
          <ion-card-content>
            <ion-grid>
              <ion-row>
                <ion-col size="auto">
                  <ion-avatar :class="{'priority-high': element.priority === 'High', 'priority-medium': element.priority === 'Medium', 'priority-low': element.priority === 'Low'}"></ion-avatar>
                </ion-col>
                <ion-col>
                  <h1>{{ element.title }}</h1>
                </ion-col>
                <ion-col size="auto" class="right-align">
                  <ion-card-title color="primary" style="font-size: 25px">{{ duration(element.duration) }}</ion-card-title>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-card-content>
        </ion-card>
      </template>
    </draggable>
  </v-cupertino>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "vue";
import VCupertino from "v-cupertino";
import { CupertinoPane } from "cupertino-pane";
import { useFirestore } from 'vuefire'
import { getAuth } from 'firebase/auth'
import draggable from "vuedraggable";
import { IonCard, IonCardTitle, IonCardContent, IonGrid, IonCol, IonRow, IonAvatar } from "@ionic/vue";
import {trashBin} from "ionicons/icons";

const db = useFirestore()
const auth = getAuth()

export default defineComponent ({
  name: "PlannerDrawer",
  emits: ['drawerTop', 'drawerBottom', 'disableDrag', 'enableDrag', 'dragging', 'notDragging'],
  components: {
    VCupertino,
    draggable,
    IonCard,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonCol,
    IonRow,
    IonAvatar
  },
  props: {
    tasks: Array
  },
  computed: {
    dragOptions() {
      return {
        delay: 100,
        animation: 200,
        group: "tasks",
        disabled: false,
        ghostClass: "ghostdrop"
      };
    },

    priorityColour: function() {
      if (this.task.priority === "High") {
        return 'priority-high'
      } else if (this.task.priority === "Medium") {
        return 'priority-medium'
      } else {
        return 'priority-low'
      }
    }
  },
  methods: {
    checkFull: function(evt) {
      return (evt.relatedContext.list.length !== 1)
    },

    getComponentData() {
      return {
        name: 'drawer'
      }
    },

    duration: function (duration) {
      // Calculate hours and minutes
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);

      // Create the formatted string
      let formattedDuration = '';

      if (hours > 0) {
        formattedDuration += `${hours}hr`;
        if (minutes > 0) {
          formattedDuration += ' ';
        }
      }

      if (minutes > 0) {
        formattedDuration += `${minutes}m`;
      }

      return formattedDuration;
    },
  },
  setup(props, { emit }) {
    const plannerDrawer: Ref<typeof VCupertino> = ref(VCupertino);

    const options = {
      animationDuration: 200,
      dragBy: ['.pane'],
      bottomOffset: 50,
      topperOverflow: true,
      draggableOver: false,
      preventClicks: true,
      preventScroll: false,
      topperOverflowOffset: 50,
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
          height: 200,
          bounce: true
        },
        bottom: {
          enabled: false
        }
      }
    }

    function getPosition() {
      const cupertino = plannerDrawer.value.cupertino as CupertinoPane;

      if (cupertino.currentBreak() === 'top') {
        emit('drawerTop')
      } else {
        emit('drawerBottom')
      }
    }

    function handleDrag() {
      const cupertino = plannerDrawer.value.cupertino as CupertinoPane;

      emit('dragging');
      cupertino.moveToBreak("middle");
    }

    function handleDrop() {
      const cupertino = plannerDrawer.value.cupertino as CupertinoPane;

      emit('notDragging')
      cupertino.moveToBreak("top");
    }


    return {
      options,
      handleDrag,
      handleDrop,
      plannerDrawer,
      getPosition,
    }

  }
})
</script>

<style>
.list-group {
  min-height: 50px;
  min-width: 300px;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghostdrop {
  background-color: #f5f6f9;
  opacity: 0.5;
}

/*.ghostdrop {*/
/*  background-color: #f5f6f9;*/
/*}*/

.priority-high {
  background: #F76868;
}

.priority-medium {
  background: #F7C068;
}

.priority-low {
  background: #02C39A;
}

</style>
