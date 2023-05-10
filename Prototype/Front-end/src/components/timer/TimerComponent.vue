<template>
  <div>
    <ve-progress v-if="mounted" thickness="10%" color="#00A896" :progress="progress" :size="300" animation="loop" font-size="2rem">
      <span slot="legend-value">{{this.timer.hours + " : " + this.timer.minutes + " : " + this.timer.seconds }}</span>
    </ve-progress>

    <ion-alert
        :is-open="alert"
        header="Alert"
        message="Timer Complete!"
        :buttons="alertButtons"
    ></ion-alert>
  </div>

  <div class="button">
    <ion-button size="large" @click="addFive">add 5m</ion-button>
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
import { IonFab, IonFabButton, IonIcon, IonButton, IonAlert } from "@ionic/vue";
import {NativeAudio} from '@capgo/native-audio'
import { pause, play } from "ionicons/icons";
import { useTimer } from 'vue-timer-hook';

NativeAudio.preload({
  assetId: "alarm",
  assetPath: "assets/sounds/alarm.mp3",
  audioChannelNum: 1,
  isUrl: false
});

export default defineComponent({
  name: "TimerComponent",
  components: {
    VeProgress,
    IonFab,
    IonFabButton,
    IonIcon,
    IonButton,
    IonAlert
  },
  data() {
    return {
      mounted: false,
      time: new Date(),
      timer: "",
      localDuration: 0,
      alert: false,
      alertButtons: [
        {
          text: 'Confirm',
          handler: () => {
            this.alert = false;
            NativeAudio.stop({
              assetId: 'alarm',
            });
          }
        }
      ],
    }
  },
  watch: {
    'timer.isExpired': {
      handler(newValue) {
        if (newValue) {
          this.alert = true;
          this.timerEngaged = false;
          NativeAudio.loop({
            assetId: 'alarm',
          });
        }
      },
      immediate: true,
    },

    task(newTask) {
      this.time = new Date();
      this.time.setSeconds(this.time.getSeconds() + newTask.duration);
      this.timer = useTimer(this.time, false);
      this.localDuration = newTask.duration;
    }
  },
  computed: {
    progress: function() {
      if (this.timer) {
        const seconds = this.localDuration - ((((this.timer.hours * 60) + this.timer.minutes) * 60) + this.timer.seconds);
        return (seconds / this.localDuration) * 100;
      } else {
       return 0;
      }
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
    task: {
      default() {
        return { duration: 900 }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.mounted = true;
    });

    this.localDuration = 900

    this.time.setSeconds(this.time.getSeconds() + 900);
    this.timer = useTimer(this.time, false);
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
  padding-top: 10px;
}

.floatingbutton {
  padding-top: 30px;
  display: flex;
  justify-content: center;
}
</style>