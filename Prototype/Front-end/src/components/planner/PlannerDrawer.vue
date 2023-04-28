<template>
  <v-cupertino id="2" :drawerOptions="options" ref="plannerDrawer">
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
        <ion-card v-if="element.startTime == null">
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
import TaskListItem from "@/components/planner/TaskListItem.vue";
import VCupertino from "v-cupertino";
import { CupertinoPane } from "cupertino-pane";
import { collection, query, onSnapshot } from "firebase/firestore";
import { useFirestore } from 'vuefire'
import { getAuth } from 'firebase/auth'
import draggable from "vuedraggable";
import { IonCard, IonCardTitle, IonCardContent, IonGrid, IonCol, IonRow, IonAvatar } from "@ionic/vue";

const db = useFirestore()
const auth = getAuth()

export default defineComponent ({
  name: "PlannerDrawer",
  components: {
    VCupertino,
    // TaskListItem,
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
  setup() {
    const plannerDrawer: Ref<typeof VCupertino> = ref(VCupertino);

    const options = {
      animationDuration: 500,
      topperOverflow: true,
      draggableOver: false,
      preventClicks: true,
      preventScroll: false,
      simulateTouch: true,
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
          height: 100,
          bounce: true
        },
        bottom: {
          enabled: false
        }
      }
    }

    function handleDrag() {
      const cupertino = plannerDrawer.value.cupertino as CupertinoPane;


      cupertino.moveToBreak("middle")
      // cupertino.destroy();
    }

    function handleDrop() {
      const cupertino = plannerDrawer.value.cupertino as CupertinoPane;

      // cupertino.present();
      cupertino.moveToBreak("top");
    }


    return {
      options,
      handleDrag,
      handleDrop,
      plannerDrawer
    }

  }
})
</script>

<style>
.list-group {
  min-height: 50px;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghostdrop {
  background-color: #f5f6f9;
}

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
