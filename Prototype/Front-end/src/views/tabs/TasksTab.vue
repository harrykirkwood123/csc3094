<template>
  <ion-page>
    <ion-content>
      <task-list-item v-for="task in tasks" :key="task.id" :task="task"></task-list-item>
      <create-task v-if="hideDrawer" ref="createTask"></create-task>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from "vue";
import { IonPage, IonContent } from "@ionic/vue";
import CreateTask from '@/components/tasks/CreateTask.vue'
import TaskListItem from "@/components/tasks/TaskListItem.vue";
import {collection} from "firebase/firestore";
import { useFirestore } from 'vuefire'
import { getAuth } from 'firebase/auth'

const db = useFirestore()
const auth = getAuth()
export default defineComponent ({
  name: "TasksTab",
  components: {
    IonPage,
    IonContent,
    CreateTask,
    TaskListItem,
  },
  data () {
    return {
      tasks: [],
      hideDrawer: false
    }
  },
  firestore: {
    tasks: collection(db, 'Tasks', auth.currentUser.uid, 'Tasks')
  },
  ionViewDidEnter() {
    // console.log("Leaving task tab drawer destroyed")
    this.hideDrawer = true;
  },
  ionViewWillLeave() {
    // console.log("Leaving task tab drawer destroyed")
    this.hideDrawer = false;
  },
  setup() {
    // onIonViewWillLeave(() => {
    //   console.log("Leaving task tab drawer destroyed")
    //   // createTask.value.destroyDrawer();
    //   hideDrawer = false;
    // })

  }
})
</script>

<style scoped>

</style>