<template>
<ion-page>
  <p>{{ uid }}</p>
  <ul>
    <li v-for="job in userJobsRef" :key="job.id">
      <span>{{ job }}</span>
    </li>
  </ul>
</ion-page>
</template>

<script>
import { defineComponent } from "vue";
import { IonPage } from "@ionic/vue";
import { useFirestore, useCollection, useDocument } from 'vuefire'
import { collection, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const db = useFirestore()
const auth = getAuth()

export default defineComponent ({
  name: "DashboardHome",
  data() {
    return {
      userJobsRef: [],
      userCollection:[],
      uid: auth.currentUser.uid
    }
  },
  firestore: {
    userCollection: collection(db, 'AccountInformation'),
    userJobsRef: collection(db, 'Tasks', auth.currentUser.uid, 'Tasks')
  },

  components: {
    IonPage
  }
})
</script>

<style scoped>

</style>