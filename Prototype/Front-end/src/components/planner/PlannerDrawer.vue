<template>
  <v-cupertino id="2" :drawerOptions="options" ref="plannerDrawer">
<!--    <div>-->
<!--      <task-list-item v-for="task in localTasks" :key="task.id" :task="task"></task-list-item>-->
<!--    </div>-->
    <draggable :list="tasks" group="tasks" itemKey="id" @start="handleDrag" @end="handleDrop">
<!--      <draggable :list="list1" group="tasks" itemKey="id" :move="rejectDrag">-->
      <template #item="{ element }">
        <ion-card>
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
  data() {
    return {
      localTasks: [],
      list1: [
        {
          id: 1,
          name: "Harry",
          duration: "5m"
        },
        {
          id: 2,
          name: "Thomas",
          duration: "2m"
        }
      ]
    }
  },
  created() {
    this.fetchDocuments();
  },
  computed: {
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

    async fetchDocuments() {
      const collectionRef = collection(db, 'Tasks', auth.currentUser.uid, 'Tasks');
      const q = query(collectionRef);

      onSnapshot(q, (querySnapshot) => {
        // Reset the local array
        this.localTasks = [];

        // Fill the local array with the fetched documents
        querySnapshot.forEach((doc) => {
          this.localTasks.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      });
    },
  },
  setup() {
    const plannerDrawer: Ref<typeof VCupertino> = ref(VCupertino);

    const options = {
      topperOverflow: true,
      draggableOver: false,
      preventClicks: false,
      preventScroll: false,
      simulateTouch: false,
      dragBy: ['.pane .draggable'],
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
          bounce: false
        },
        bottom: {
          enabled: false
        }
      }
    }

    function handleDrag() {
      const cupertino = plannerDrawer.value.cupertino as CupertinoPane;

      cupertino.moveToBreak("middle")
    }

    function handleDrop() {
      const cupertino = plannerDrawer.value.cupertino as CupertinoPane;

      cupertino.moveToBreak("top")
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
