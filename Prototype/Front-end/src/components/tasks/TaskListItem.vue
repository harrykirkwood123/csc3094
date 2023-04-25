<template>
  <ion-card @click="viewTimer(task)">
    <ion-card-content>
      <ion-grid>
        <ion-row>
          <ion-col size="auto">
            <ion-avatar :class="priorityColour"></ion-avatar>
          </ion-col>
          <ion-col>
            <h1>{{ task.title }}</h1>
          </ion-col>
          <ion-col size="auto" class="right-align">
            <ion-card-title color="primary" style="font-size: 25px">{{ duration }}</ion-card-title>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-card-content>
  </ion-card>
</template>

<script>
import { defineComponent } from "vue";
import { IonCard, IonCardTitle, IonCardContent, IonGrid, IonCol, IonRow, IonAvatar } from "@ionic/vue";
import { useRouter } from "vue-router";

export default defineComponent ({
  name: "TaskListItem",
  components: {
    IonCard,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonCol,
    IonRow,
    IonAvatar
  },
  props: {
    task: Object
  },
  methods: {
    viewTimer(task) {
      this.router.push({ path: '/timer/' + this.task.id + '/' + this.task.duration})
    }
  },
  setup() {
    const router = useRouter()
    return {
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
}

.priority-medium {
  background: #F7C068;
}

.priority-low {
  background: #02C39A;
}

.right-align {
  text-align: right;
}
</style>