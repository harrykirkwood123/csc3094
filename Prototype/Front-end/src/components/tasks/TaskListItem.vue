<template>
  <ion-card v-if="task.completed === false">
    <ion-card-content>
      <ion-grid>
        <ion-row>
          <ion-col size="3">
            <ion-avatar :class="priorityColour" @click="markTaskCompleted(task)" ref="completedCircle">
              <ion-icon style="color: #ffffff; font-size: 1.6rem" :icon="checkmark"></ion-icon>
            </ion-avatar>
          </ion-col>
          <ion-col @click="viewTimer(task)">
            <h1 style="font-size: 1.1rem; text-align: left; padding-top: 10px">{{ task.title }}</h1>
          </ion-col>
          <ion-col size="auto" class="right-align">
            <ion-card-title color="primary" style="font-size: 1.6rem; padding-top: 10px">{{ duration }}</ion-card-title>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-card-content>
  </ion-card>
</template>

<script>
import { defineComponent } from "vue";
import { IonCard, IonCardTitle, IonCardContent, IonGrid, IonCol, IonRow, IonAvatar, IonIcon } from "@ionic/vue";
import { checkmark } from "ionicons/icons";
import { useRouter } from "vue-router";
import api from "@/api/api";

export default defineComponent ({
  name: "TaskListItem",
  components: {
    IonCard,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonCol,
    IonRow,
    IonAvatar,
    IonIcon
  },
  props: {
    task: Object
  },
  methods: {
    // viewTimer(task) {
    //   this.router.push({ path: '/timer/' + this.task.id + '/' + this.task.duration})
    // },

    async viewTimer(task) {
      this.$emit('viewTimer', task)
    },

    async markTaskCompleted(task) {
      const { markCompleted } = api();

      await markCompleted({
        id: task.id
      });

    }
  },
  setup() {
    const router = useRouter()

    return {
      checkmark,
      router
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
.priority-high {
  background: #F76868;
  display: flex;
  justify-content: center; /* Horizontally centers text */
  align-items: center;
}

.priority-medium {
  background: #F7C068;
  display: flex;
  justify-content: center; /* Horizontally centers text */
  align-items: center;
}

.priority-low {
  background: #02C39A;
  display: flex;
  justify-content: center; /* Horizontally centers text */
  align-items: center;
}

.right-align {
  text-align: right;
  display: flex;
  justify-content: center; /* Horizontally centers text */
  align-items: center;
}
</style>