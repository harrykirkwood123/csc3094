<template>
  <ion-page>
    <ion-content ref="contentRef" :scroll-y="draggable">
        <Timeline align="left" layout="vertical" :value="times">
          <template #opposite="slotProps">
            <span :ref="slotProps.item.time.toString()">{{ formatTimeFromSeconds(slotProps.item.time) }}</span>
          </template>
          <template #content="slotProps">
            <draggable
                       delay-on-touch-only="true"
                       class="list-group"
                       v-bind="dragOptions"
                       v-model="slotProps.item.task"
                       :item-key="itemKey"
                       @add="handleDrag(slotProps)"
                       @start="dragging"
                       @end="notDragging"
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



      <ion-icon></ion-icon>

      <planner-drawer :tasks="tasks"  @disable-drag="disableDrag" @enable-drag="enableDrag" @dragging="$emit('lockSlide')" @not-dragging="$emit('unlockSlide')"></planner-drawer>

      <ion-fab v-if="fab" :activated="active" :class="{ 'ion-activated': active }" style="padding-bottom: 200px;" slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button>
          <draggable
              tag="ion-icon"
              v-model="removed"
              group="tasks"
              item-key="id"
              v-bind="removeOptions"
              :component-data="{
                          icon: trashBin,
                          id: 'trash'
                       }"
              @change="callRemoveStartTime"
              ghost-class="ghostdrop">
            <template #item="{}">
            </template>
          </draggable>
        </ion-fab-button>
      </ion-fab>

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
import draggable from "vuedraggable";
import {collection, onSnapshot, query} from "firebase/firestore";
import {useFirestore} from "vuefire";
import {getAuth} from "firebase/auth";
import api from "@/api/api";

const db = useFirestore()
const auth = getAuth()
export default defineComponent( {
  name: "PlannerTab",
  emits: ['lockSlide', 'unlockSlide'],
  props: {
    tab: Boolean
  },
  data() {
    return {
      fab: false,
      active: false,
      times: [],
      hideDrawer: false,
      tasks: [],
      planner: [],
      setOccupied: false,
      populated: false,
      removed: [],
      draggable: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.times = this.createEmptyTimesArray();
      this.populateTimesWithTasks();
    });
  },
  watch: {
    tasks: {
      deep: true,
      handler() {
        if (this.populated === false) {
          this.times = this.createEmptyTimesArray();
          this.populateTimesWithTasks();
          this.getTimePos();
          this.populated = true;
        }
      }
    }
  },
  created() {
    this.fetchDocuments();

  },
  computed: {
    dragOptions() {
      return {
        delay: 100,
        animation: 200,
        group: "tasks",
        disabled: false,
        ghostClass: "ghostdrop",
      };
    },

    removeOptions() {
      return {
        animation: 200,
        group: "tasks",
        disabled: false
      };
    }
  },
  methods: {
    dragging() {
      console.log("dragging")
      this.draggable = false
      this.fab = true;
      this.$emit('lockSlide');
    },

    notDragging() {
      console.log("not dragging")
      this.draggable = true
      this.fab = false;
      this.$emit('unlockSlide');
    },

    enableDrag() {
      this.draggable = true;
    },

    disableDrag() {
      this.draggable = false;
    },

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
      const { removeStartTime } = api()
      this.active = false;

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

      let difference = 0;
      let closest = 0;

      for (let i = 0; i < this.times.length; i++) {
        if (i === 0) {
          difference = currentTime - this.times[i].time;
        } else if (currentTime - this.times[i].time < difference && currentTime - this.times[i].time >= 0) {
          difference = currentTime - this.times[i].time;
          closest = this.times[i].time
        }
      }

      const rect = this.$refs[closest.toString()].getBoundingClientRect();

      const y = rect.top + scrollPosition.scrollTop;

      await this.$refs.contentRef.$el.scrollToPoint(0, y - 200, 500);
    },

    itemKey: function (evt) {
      return evt.id.toString()
    },

    checkFull: function(evt) {
      this.active = false;
      if (evt.relatedContext.component.componentData) {
        if (evt.relatedContext.component.componentData.name === "flip-list") {
          return false
        } else if (evt.relatedContext.component.componentData.id === "trash") {
          this.active = true;
          return true
        }
      } else if ((evt.relatedContext.list.length !== 1)) {
        return true
      } else {
        return false
      }
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
          occupied: false
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
    IonFab,
    IonFabButton,
    IonIcon
  }
})
</script>

<style scoped>
.ion-activated {
  --box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  --transform: scale(1.1);
  --transition: 0.2s transform ease-out;
}

.ghostdrop {
  background-color: #f5f6f9;
  opacity: 0.5;
}

.list-group {
  min-height: 50px;
  min-width: 300px;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0.5s;
}

:deep(.p-timeline) {
  padding-bottom: 250px;
  padding-top: 20px;
  position: absolute;
  font-family: "Gotham Rounded", sans-serif;
}

:deep(.p-timeline .p-timeline-event) {
  padding: 0 0;
}

:deep(.p-timeline-event-opposite) {
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: 65px;
}



:deep(.p-timeline.p-timeline-vertical .p-timeline-event-opposite) {
  padding: 0 10px 0 0;

}

:deep(.p-timeline .p-timeline-event-content ) {
  padding: 0 0;

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