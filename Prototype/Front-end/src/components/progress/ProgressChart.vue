<template>
  <div>
    <h1>tasks completed: <span class="total-tasks"> {{ tasksTotal }} </span></h1>
    <div style="max-height: 350px; display: flex; justify-content: center; align-items: center;">
      <Bar
          id="progress-chart"
          :options="chartOptions"
          :data="taskProgress"

          v-if="tasks"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, BarElement, CategoryScale, LinearScale } from 'chart.js'
import {collection} from "firebase/firestore";
import { useFirestore } from 'vuefire'
import { getAuth } from 'firebase/auth'
ChartJS.register(Title, BarElement, CategoryScale, LinearScale)

const db = useFirestore()
const auth = getAuth()

export default defineComponent ({
  name: "ProgressChart",
  firestore: {
    tasks: collection(db, 'Tasks', auth.currentUser.uid, 'Tasks')
  },
  data() {
    return {
      tasks: [],
      tasksTotal: 0,
      chartData: {
        labels: ['m', 't', 'w', 't', 'f', 's', 's'],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#00A896',
            data: [3, 5, 2, 5, 7, 3, 1],
            borderRadius: 12,
            borderSkipped: false,
          }
        ]
      },
      chartOptions: {
        responsive: true,
        aspectRatio: 1.1,
        scales: {
          x: {
            border: {
              display: false
            },
            grid: {
              display: false
            },
            ticks: {
              font: {
                family: "'Gotham Rounded'",
                size: 20
              }
            }
          },
          y: {
            suggestedMax: 10,
            border: {
              display: false
            },
            grid: {
              display: false
            },
            ticks: {
              font: {
                family: "'Gotham Rounded'",
                size: 20
              }
            }
          }
        },
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 10,
            bottom: 0
          }
        }
      }
    }
  },
  methods: {
    calculateCompleted() {
      // Initialize an array of 7 zeros representing the tasks completed on each day of the week
      const tasksCompleted = [0, 0, 0, 0, 0, 0, 0];

      // Loop through all the tasks in the Firestore collection and increment the corresponding day's count if the task was completed
      this.tasks.forEach((task) => {
        if (task.completed) {
          const completedDate = task.completedTime.toDate();
          const dayOfWeek = completedDate.getDay();
          // Map Sunday (0) to the last day of the week (6) to match the order of the chart labels
          const mappedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
          tasksCompleted[mappedDayOfWeek]++;
        }
      });

      this.tasksTotal = tasksCompleted.reduce((a, b) => a + b, 0)

      return tasksCompleted;
    }
  },
  computed: {
    myStyles () {
      return {
        position: 'relative',
        height: '230px'
      }
    },

    taskProgress() {
      const tasksCompleted = this.calculateCompleted();

      return {
        labels: ['m', 't', 'w', 't', 'f', 's', 's'],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#00A896',
            data: tasksCompleted,
            borderRadius: 20,
            borderSkipped: false,
          }
        ]
      };
    }
  },
  components: {
    Bar
  },
})
</script>

<style scoped>
.total-tasks{
  font-size: 2rem;
  font-weight: bold;
  color: #02C39A;
}
</style>