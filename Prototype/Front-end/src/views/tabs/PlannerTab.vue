<template>
  <ion-page>
    <ion-content ref="contentRef">
        <Timeline align="left" layout="vertical" :value="times">
          <template #opposite="slotProps">
            <span :ref="slotProps.item.time.toString()" v-if="!slotProps.item.hidden">{{ formatTimeFromSeconds(slotProps.item.time) }}</span>
          </template>
          <template #content="slotProps">
            <draggable
                       class="list-group"
                       v-bind="dragOptions"
                       ghost-class="ghostdrop"
                       v-model="slotProps.item.task"
                       group="tasks"
                       :item-key="itemKey"
                       @add="handleDrag(slotProps)"
                       :move="checkFull">
              <template #item="{ element }">
                <ion-card>
                  <ion-card-content>
                    <ion-grid class="ion-no-padding">
                      <ion-row>
                        <ion-col size="auto" class="left-align">
                          <ion-avatar style="max-width: 30px; max-height: 30px" :class="{'priority-high': element.priority === 'High', 'priority-medium': element.priority === 'Medium', 'priority-low': element.priority === 'Low'}"></ion-avatar>
                        </ion-col>
                        <ion-col>
                          <h2 style="padding-left: 10px">{{ element.title }}</h2>
                        </ion-col>
                        <ion-col size="auto" class="right-align">
                          <ion-card-title color="primary" style="font-size: 18px">{{ duration(element.duration) }}</ion-card-title>
                        </ion-col>
                      </ion-row>
                    </ion-grid>
                  </ion-card-content>
                </ion-card>
              </template>
            </draggable>
          </template>
        </Timeline>

      <ion-fab style="padding-bottom: 55px" slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button>
          <draggable
              v-model="removed"
              group="tasks"
              item-key="id"
              v-bind="removeOptions"
              :component-data="getComponentData()"
              @change="callRemoveStartTime">
            <template #item="{}">
              <ion-icon :icon="trashBin"></ion-icon>
            </template>
          </draggable>
        </ion-fab-button>
      </ion-fab>

      <ion-icon></ion-icon>

      <planner-drawer v-if="tab" :tasks="tasks"></planner-drawer>
    </ion-content>
  </ion-page>
</template>

<script>
import Timeline from 'primevue/timeline';
import {defineComponent} from "vue";
import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  IonFab,
  IonFabButton,
  IonIcon
} from "@ionic/vue";
import PlannerDrawer from "@/components/planner/PlannerDrawer.vue";
import { trashBin } from 'ionicons/icons';
import TrashCan from "@/components/planner/TrashCan.vue";
import draggable from "vuedraggable";
import {collection, onSnapshot, query} from "firebase/firestore";
import {useFirestore} from "vuefire";
import {getAuth} from "firebase/auth";
import api from "@/api/api";

const db = useFirestore()
const auth = getAuth()
export default defineComponent( {
  name: "PlannerTab",
  props: {
    tab: Boolean
  },
  data() {
    return {
      times: [],
      hideDrawer: false,
      tasks: [],
      planner: [],
      setOccupied: false,
      populated: false,
      removed: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getTimePos();
      this.times = this.createEmptyTimesArray();
      this.populateTimesWithTasks();
      console.log(this.times)
    });
  },
  watch: {
    tasks: {
      deep: true,
      handler() {
        if (this.populated === false) { // Only trigger the watcher when a new task is added
          this.populateTimesWithTasks();
          this.populated = true;
        }
      }
    }
  },
  ionViewDidEnter() {
    this.hideDrawer = true;
  },
  ionViewWillLeave() {
    this.hideDrawer = false;
  },
  created() {
    this.fetchDocuments();

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

    removeOptions() {
      return {
        animation: 200,
        group: "tasks",
        disabled: false,
        emptyInsertThreshold: 30
      };
    }
  },
  methods: {
    getComponentData() {
      return {
        tag: 'ion-icon',
        icon: trashBin,
      }
    },

    async callSetStartTime(task) {
      const { setStartTime } = api()

      await setStartTime(task)
    },

    async callRemoveStartTime(task) {
      console.log(task)
      const { removeStartTime } = api()

      this.removed = [];

      await removeStartTime(task.added.element).then(() => {
        const newTimes = this.createEmptyTimesArray();

        this.populateNewTimesArray(newTimes);
        this.adjustTaskPositions(newTimes);
        this.removeHiddenSlots(newTimes);
      })
    },

    getCurrentTime() {
      // Get the current date and time
      const now = new Date();

      // Calculate the number of minutes elapsed since midnight
      const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();

      // Round to the nearest 15 minutes
      const nearest15Mins = Math.round(minutesSinceMidnight / 15) * 15;

      // Calculate the remaining minutes and hours
      const remainingHours = Math.floor(nearest15Mins / 60);
      const remainingMinutes = nearest15Mins % 60;

      // Get the number of seconds passed since midnight
      return remainingHours * 3600 + remainingMinutes * 60;
    },

    async getTimePos() {
      const contentEl = this.$refs.contentRef.$el;
      const scrollPosition = await contentEl.getScrollElement();

      const currentTime = this.getCurrentTime();

      const rect = this.$refs[currentTime.toString()].getBoundingClientRect();
      const y = rect.top + scrollPosition.scrollTop;

      await this.$refs.contentRef.$el.scrollToPoint(0, y - 400, 500);
    },

    itemKey: function (evt) {
      return evt.id.toString()
    },

    checkFull: function(evt) {
      return (evt.relatedContext.list.length !== 1)
    },

    formatTimeFromSeconds(timeInSeconds) {
      const hours = Math.floor(timeInSeconds / 3600);
      const minutes = Math.floor((timeInSeconds - (hours * 3600)) / 60);
      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      return `${formattedHours}:${formattedMinutes}`;
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

    setOccupyTrue: function(task) {
      if (this.setOccupied !== true) {
        this.times[task.index].occupied = false;
        this.setOccupied = true;
        return true
      }
    },

    handleDrag: function(task) {
      const newTimes = this.createEmptyTimesArray();

      this.populateNewTimesArray(newTimes);
      this.adjustTaskPositions(newTimes);
      this.removeHiddenSlots(newTimes);

      this.callSetStartTime({
        id: task.item.task[0].id,
        startTime: task.item.time
      })

      this.times = newTimes;
    },

    createEmptyTimesArray: function() {
      const newTimes = [];

      for (let i = 0; i < (24 * 4); i++) {
        newTimes.push({
          time: i * 900,
          task: [],
          occupied: false,
          hidden: false
        });
      }

      return newTimes;
    },

    populateTimesWithTasks: function() {
      for (let i = 0; i < this.tasks.length; i++) {
        const task = this.tasks[i];
        if (task.startTime !== undefined && task.startTime !== null && task.completed !== true) {
          const timeIndex = this.times.findIndex(timeSlot => timeSlot.time === task.startTime);

          if (timeIndex !== -1) {
            this.times[timeIndex].task.push(task);
            this.times[timeIndex].occupied = true;

            // this.tasks.splice(i, 1);
          }
        }
      }
      this.adjustTaskPositions(this.times);
      this.removeHiddenSlots(this.times);
    },

    populateNewTimesArray: function(newTimes) {
      this.times.forEach(timeSlot => {
        if (timeSlot.task.length === 1) {
          timeSlot.occupied = true;
          const newTimeSlot = newTimes.find(newTime => newTime.time === timeSlot.time);

          if (newTimeSlot) {
            newTimeSlot.task = timeSlot.task;
            newTimeSlot.occupied = true;
          }
        } else {
          timeSlot.occupied = false;
        }
      });
    },

    adjustTaskPositions: function(newTimes) {
      newTimes.forEach((timeSlot, index) => {
        if (timeSlot.occupied) {
          const durationSize = timeSlot.task[0].duration / 900;
          const overlappingTasks = [];

          // Collect overlapping tasks
          for (let c = 1; c < durationSize; c++) {
            const nextTimeSlot = newTimes[index + c];
            if (nextTimeSlot && nextTimeSlot.occupied) {
              overlappingTasks.push(nextTimeSlot.task);
              nextTimeSlot.task = [];
              nextTimeSlot.occupied = false;
            }
          }

          // Shift overlapping tasks
          if (overlappingTasks.length > 0) {
            overlappingTasks.forEach(task => {
              // Find the first unoccupied slot for the task
              const unoccupiedSlot = newTimes.slice(index + durationSize).find(slot => !slot.occupied);
              if (unoccupiedSlot) {
                unoccupiedSlot.task = task;
                unoccupiedSlot.occupied = true;
              } else {
                // If there are no unoccupied slots, add a new one
                newTimes.push({
                  time: newTimes[newTimes.length - 1].time + 900,
                  task: task,
                  occupied: true,
                  hidden: false
                });
              }
            });
          }
        }
      });
    },

    removeHiddenSlots: function(newTimes) {
      for (let i = 0; i < newTimes.length; i++) {
        if (newTimes[i].occupied) {
          const durationSize = newTimes[i].task[0].duration / 900;
          newTimes.splice(i + 1, durationSize - 1);
        }
      }
    },
    async fetchDocuments() {
      const collectionRef = collection(db, 'Tasks', auth.currentUser.uid, 'Tasks');
      const q = query(collectionRef);

      onSnapshot(q, (querySnapshot) => {
        // Reset the local array
        this.tasks = [];

        // Fill the local array with the fetched documents
        querySnapshot.forEach((doc) => {
          this.tasks.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      });
    },
  },
  setup () {
    return {
      trashBin
    }
  },
  components: {
    IonPage,
    IonContent,
    IonCard,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonCol,
    IonRow,
    IonAvatar,
    PlannerDrawer,
    draggable,
    Timeline,
    // TrashCan,
    IonFab,
    IonFabButton,
    IonIcon
  }
})
</script>

<style scoped>
.ghostdrop {
  background-color: #f5f6f9;
  opacity: 0.5;
}

.list-group {
  min-height: 30px;
  min-width: 270px;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0.5s;
}

:deep(.p-timeline) {
  padding-bottom: 50px;
  position: absolute;
  font-family: "Gotham Rounded", sans-serif;
  /*align-self: flex-start;*/
}

:deep(.p-timeline .p-timeline-event) {
  padding: 0 0;
}

:deep(.p-timeline-event-opposite) {
  flex: 1;
  /*position: relative;*/

}

:deep(.p-timeline .p-timeline-event-content ) {
  padding: 0 0;
  /*position: relative;*/

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