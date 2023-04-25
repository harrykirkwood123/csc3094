<template>
  <ion-page>
    <ion-content>
      <draggable v-model="planner" group="tasks" itemKey="id" :move="handleDrag">
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
      <planner-drawer v-if="hideDrawer" :tasks="tasks"></planner-drawer>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from "vue";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonCol,
  IonRow,
  IonAvatar,
} from "@ionic/vue";
import PlannerDrawer from "@/components/planner/PlannerDrawer.vue";
import draggable from "vuedraggable";
import {collection, onSnapshot, query} from "firebase/firestore";
import {useFirestore} from "vuefire";
import {getAuth} from "firebase/auth";
const db = useFirestore()
const auth = getAuth()
export default defineComponent( {
  name: "PlannerTab",
  data() {
    return {
      hideDrawer: false,
      tasks: [],
      planner: []
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
    handleDrag: function(evt) {
      // if (evt.)
      // console.log(evt.relatedContext.list)
      // this.list2 = evt.relatedContext.list
      return true;
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
  }
})
</script>

<style scoped>

</style>