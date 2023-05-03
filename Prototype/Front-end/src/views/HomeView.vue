<template>
  <ion-page>
    <ion-header>
      <ion-toolbar style="min-height: 70px; --background: #ffffff; --border-color: #ffffff;">
        <div class="swiper-pagination" slot="end">
          <span
              v-for="(slide, index) in tabs"
              :key="index"
              :class="['custom-bullet', { 'swiper-pagination-bullet-active': index === activeIndex }]"
              :style="{
              transform: `translateX(${(index - activeIndex) * (index === activeIndex - 1 || index === activeIndex + 1 ? 180 : 180)}%)`,
              fontSize: index === activeIndex ? '2rem' : '1.2rem',
              opacity: index === activeIndex ? 1 : 0.5
            }"
          >
            {{ slide }}
          </span>
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content scroll-y="false">
      <swiper :modules="modules"
              @swiper="setSwiperInstance"
              :slides-per-view="1"
              :space-between="10"
              class="swiper"
              @slideChange="onSlideChange">
        <swiper-slide>
          <progress-tab></progress-tab>
        </swiper-slide>
        <swiper-slide>
          <planner-tab :tab="activeIndex === 1"></planner-tab>
        </swiper-slide>
        <swiper-slide>
          <tasks-tab @view-timer-parent="viewTimer" :tab="activeIndex === 2"></tasks-tab>
        </swiper-slide>
        <swiper-slide>
          <timer-tab :task="data.task"></timer-tab>
        </swiper-slide>
        <swiper-slide>
          <settings-tab></settings-tab>
        </swiper-slide>
      </swiper>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonContent, IonicSlides, IonHeader, IonToolbar } from '@ionic/vue';
import { readerOutline, timerOutline, cogOutline, analyticsOutline, calendarNumberOutline } from 'ionicons/icons';
import TasksTab from "@/views/tabs/TasksTab.vue";
import PlannerTab from "@/views/tabs/PlannerTab.vue";
import TimerTab from "@/views/tabs/TimerTab.vue";
import ProgressTab from "@/views/tabs/ProgressTab.vue";
import SettingsTab from "@/views/tabs/SettingsTab.vue";
import useState from "@/hooks/dataStore";
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from "swiper";
import { defineComponent, ref, reactive } from 'vue';
import 'swiper/css/pagination';

export default defineComponent( {
  name: "HomeView",
  data() {
    return {
      tabs: ["progress", "planner", "tasks", "timer", "settings"],
      activeIndex: 0
    }
  },
  computed: {
    currentSlideName() {
      if (this.tabs.length > 0 && this.activeIndex < this.tabs.length) {
        return this.tabs[this.activeIndex].title;
      }
      return '';
    },
  },
  components: {
    IonPage,
    IonContent,
    Swiper,
    SwiperSlide,
    TasksTab,
    PlannerTab,
    IonToolbar,
    TimerTab,
    ProgressTab,
    SettingsTab,
    IonHeader,
  },
  methods: {
    onSlideChange(swiper) {
      this.activeIndex = swiper.activeIndex;
      console.log(this.activeIndex)
    }
  },
  setup() {
    const { setUser } = useState()

    const data = reactive({
      task: {}
    })

    setUser()

    const slides = ref();
    const setSwiperInstance = (swiper) => {
      slides.value = swiper;
      slides.value.slideTo(2);
    }

    function viewTimer(task) {
      slides.value.slideTo(3);
      data.task = task
    }

    return {
      modules: [Pagination, IonicSlides],
      readerOutline,
      timerOutline,
      cogOutline,
      analyticsOutline,
      calendarNumberOutline,
      setSwiperInstance,
      slides,
      viewTimer,
      data
    }
  }
});
</script>

<style scoped>
.swiper {
  height: 100%
}

.swiper-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: absolute;
  padding-top: 10px;
}

.custom-bullet {
  position: absolute;
  white-space: nowrap;
  transition: all 0.3s ease;
  cursor: pointer;
}

.swiper-pagination-bullet-active {
  color: #00A896;
  background-color: #ffffff;
}

</style>