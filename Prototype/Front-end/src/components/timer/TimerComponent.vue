<template>
  <div class="container">
    <ve-progress thickness="8%" color="#00A896" :progress="progress" :size="250" animation="loop" font-size="2rem">
      <span slot="legend-value">{{this.timer.hours + " : " + this.timer.minutes + " : " + this.timer.seconds }}</span>
    </ve-progress>
  </div>

  <div class="button">
    <ion-button @click="addFive">add 5m</ion-button>
  </div>

  <div class="floatingbutton">
    <ion-fab>
      <ion-fab-button>
        <ion-icon :src="playPause" @click="toggleTimer"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </div>


</template>

<script>
import { defineComponent } from "vue";
import { VeProgress } from "vue-ellipse-progress";
import { IonFab, IonFabButton, IonIcon, IonButton } from "@ionic/vue";
import { pause, play } from "ionicons/icons";
import { useTimer } from 'vue-timer-hook';

export default defineComponent({
  name: "TimerComponent",
  components: {
    VeProgress,
    IonFab,
    IonFabButton,
    IonIcon,
    IonButton
  },
  data() {
    return {
      time: new Date(),
      timer: "",
      localDuration: 0
    }
  },
  computed: {
    progress: function() {
      const seconds = this.localDuration - ((((this.timer.hours * 60) + this.timer.minutes) * 60) + this.timer.seconds)
      return (seconds / this.localDuration) * 100
    },
    playPause: function() {
      if (this.timer.isRunning === true) {
        return pause
      } else {
        return play
      }
    }
  },
  methods: {
    addFive() {
      this.time.setSeconds(this.time.getSeconds() + 300);
      this.localDuration += 300;
      this.timer.restart();
    },

    toggleTimer() {
      if (this.timer.isRunning === true) {
        this.timer.pause()
      } else {
        this.timer.resume()
      }
    }
  },
  props :{
    task: String,
    duration: String
  },
  mounted() {
    this.localDuration = this.duration

    if (this.duration !== null) {
      this.time.setSeconds(this.time.getSeconds() + parseInt(this.duration));
      this.timer = useTimer(this.time, false);
    } else {
      this.time.setSeconds(this.time.getSeconds() + 600);
      this.timer = useTimer(this.time, false);
    }
  },
  setup () {
    return {
      pause,
      play
    }
  }
})
</script>

<style>
.button {
  display: flex;
  align-items: center;
  justify-content: center;
}

.floatingbutton {
  padding-top: 30px;
  display: flex;
  justify-content: center;
}

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50%;
}
</style>