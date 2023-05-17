<template>
  <div style="padding-bottom: 30px;">
    <ve-progress v-if="tasks" thickness="10%" color="#00A896" :progress="calculateProgress" :size="250" animation="loop" font-size="1.6rem">
      <span slot="legend-value">{{ calculateHours }} / {{ preferences.goal }}</span><br>
      <span slot="legend-value">hours</span>
    </ve-progress>
  </div>
</template>

<script>
import { VeProgress } from "vue-ellipse-progress";
import { defineComponent } from "vue";
import {useFirestore} from "vuefire";
import {getAuth} from "firebase/auth";
import {collection, doc} from "firebase/firestore";

const db = useFirestore()
const auth = getAuth()

export default defineComponent ({
  name: "HoursWorked",
  data() {
    return {
      tasks: [],
      preferences: []
    }
  },
  firestore: {
    tasks: collection(db, 'Tasks', auth.currentUser.uid, 'Tasks'),
    preferences: doc(db, 'UserPreferences', auth.currentUser.uid)
  },
  components: {
    VeProgress
  },
  computed: {
    calculateHours() {
      let sum = 0
      this.tasks.forEach((task) => {
        sum += task.duration
      });

      return (sum / 60) / 60;
    },

    calculateProgress() {
      return (this.calculateHours / this.preferences.goal) * 100;
    }
  }
})
</script>

<style scoped>

</style>