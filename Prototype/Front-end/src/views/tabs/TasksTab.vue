<template>
  <ion-page>
    <ion-content :scroll-y="draggable">
      <div v-if="placeholder">
        <task-list-item @view-timer="viewTimerParent" v-for="task in tasks" :key="task.id" :task="task"></task-list-item>
      </div>
      <ion-card v-else @click="showBottomSheet">
        <ion-card-content style="font-size: 1.4rem; padding-bottom: 30px">
          swipe up to create a task!
        </ion-card-content>
      </ion-card>
      <create-task @disable-drag="disableDrag" @enable-drag="enableDrag" style="padding-top: 130px" ref="createTaskRef"></create-task>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { IonPage, IonContent, IonCard, IonCardContent } from "@ionic/vue";
import CreateTask from '@/components/tasks/CreateTask.vue'
import TaskListItem from "@/components/tasks/TaskListItem.vue";
import {collection} from "firebase/firestore";
import { useFirestore } from 'vuefire'
import { getAuth } from 'firebase/auth'
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const db = useFirestore()
const auth = getAuth()
export default defineComponent ({
  name: "TasksTab",
  components: {
    IonPage,
    IonContent,
    CreateTask,
    TaskListItem,
    IonCard,
    IonCardContent
  },
  props: {
    tab: Boolean
  },
  data () {
    return {
      tasks: [],
      hideDrawer: true,
      draggable: true
    }
  },
  computed: {
    placeholder() {
      if (this.tasks.length > 0) {
        let count = 0
        for (let i = 0; i < this.tasks.length; i++) {
          const task = this.tasks[i]
          if (task.completed === true) {
            count += 1
          }
        }
        if (count >= this.tasks.length) {
          return false
        } else {
          return true
        }
      } else {
        return false
      }
    }
  },
  methods: {
    enableDrag() {
      this.draggable = true;
    },

    disableDrag() {
      this.draggable = false;
    },

    async viewTimerParent(task) {
      this.$emit("viewTimerParent", task)
    }
  },
  firestore: {
    tasks: collection(db, 'Tasks', auth.currentUser.uid, 'Tasks')
  },
  setup( ) {
    const createTaskRef = ref()

    async function showBottomSheet() {
      await Haptics.impact({ style: ImpactStyle.Medium });
      createTaskRef.value.showDrawer();
    }

    return {
      createTaskRef,
      showBottomSheet
    }
  }
})
</script>