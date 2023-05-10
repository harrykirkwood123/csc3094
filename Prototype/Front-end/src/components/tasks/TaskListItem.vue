<template>
  <ion-card :class="{ 'slide-off': dismissed }" v-if="task.completed === false">
    <ion-card-content style="padding-inline-end: 8px">
      <ion-grid>
        <ion-row>
          <ion-col size="2">
            <ion-avatar :class="[priorityColour, { 'spin-once': spin }]" @click="markTaskCompleted(task)" ref="completedCircleRef" @mousedown="press" @mouseup="release" @onmouseleave="release">
              <ion-icon v-if="spin" style="color: #ffffff; font-size: 1.6rem" :icon="checkmark"></ion-icon>
            </ion-avatar>
          </ion-col>
          <ion-col :id="task.id" style="padding-left: 20px">
            <h1 style="font-size: 1.1rem; text-align: left; padding-top: 10px">{{ task.title }}</h1>
          </ion-col>
          <ion-popover :trigger="task.id" trigger-action="click" :dismiss-on-select="true">
            <ion-list>
              <ion-item :button="true" :detail="false" @click="viewTimer(task)">Start Timer</ion-item>
              <ion-item :button="true" :detail="false" @click="callDeleteTask(task)">Delete Task</ion-item>
            </ion-list>
          </ion-popover>
          <ion-col size="auto" class="right-align">
            <ion-card-title color="primary" style="font-size: 1.6rem;">{{ duration }}</ion-card-title>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-card-content>
  </ion-card>
</template>

<script>
import { defineComponent, ref } from "vue";
import { IonCard, IonCardTitle, IonCardContent, IonGrid, IonCol, IonRow, IonAvatar, IonIcon, IonPopover, IonList, IonItem } from "@ionic/vue";
import { checkmark } from "ionicons/icons";
import { useRouter } from "vue-router";
import api from "@/api/api";

export default defineComponent ({
  name: "TaskListItem",
  data() {
    return {
      dismissed: false,
      spin: false
    }
  },
  components: {
    IonCard,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonCol,
    IonRow,
    IonAvatar,
    IonIcon,
    IonPopover,
    IonList,
    IonItem
  },
  props: {
    task: Object
  },
  methods: {
    press(event) {
      event.target.classList.add("active");
    },
    release(event) {
      event.target.classList.remove("active");
    },

    async viewTimer(task) {
      this.$emit('viewTimer', task)
    },

    async markTaskCompleted(task) {
      const { markCompleted } = api();

      this.spin = true;
      setTimeout(() => {
        this.dismissed = true;
        setTimeout(async () => {
          await markCompleted({
            id: task.id
          });
        }, 500);
      }, 700);
    },

    async callDeleteTask(task) {
      const { deleteTask } = api();

      await deleteTask({
        id: task.id
      });
    },
  },
  setup() {
    const router = useRouter()

    return {
      checkmark,
      router,
    }
  },
  computed: {
    duration: function formatDuration() {
      // Calculate hours and minutes
      const hours = Math.floor(this.task.duration / 3600);
      const minutes = Math.floor((this.task.duration % 3600) / 60);

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
    priorityColour: function() {
      if (this.task.priority === "High") {
        return 'priority-high'
      } else if (this.task.priority === "Medium") {
        return 'priority-medium'
      } else {
        return 'priority-low'
      }
    }
  }
})
</script>

<style scoped>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.spin-once {
  animation: spin 0.7s ease-in-out;
}

@keyframes slide-off {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-100%);
    opacity: 0;
  }
}

.slide-off {
  animation: slide-off 0.5s ease-in-out forwards;
}

.priority-high {
  background: #F76868;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 100ms ease-in-out;
}

.priority-medium {
  background: #F7C068;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 100ms ease-in-out;
}

.priority-low {
  background: #02C39A;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 100ms ease-in-out;
}

.priority-low:active {
  opacity: 0.7;
}

.priority-medium:active {
  opacity: 0.7;
}

.priority-high:active {
  opacity: 0.7;
}

.right-align {
  text-align: right;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>