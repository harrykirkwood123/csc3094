<template>
  <ion-page>
    <ion-header>
      <ion-toolbar style="min-height: 70px; --background: #ffffff; --border-color: #ffffff;">
        <div class="swiper-pagination" slot="end">
          <span
              v-for="(slide, index) in tabs"
              :key="index"
              :class="[
              'custom-bullet',
              { 'swiper-pagination-bullet-active': index === activeIndex }
            ]"
              @click="handlePaginationClick(index)"
              :style="{
              transform: `translateX(${
                (index - activeIndex) * (
                  index === activeIndex - 1 || index === activeIndex + 1
                    ? 180
                    : 180
                )
              }%)`,
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
              @slideChange="onSlideChange"
              @slideChangeTransitionStart="destroyPanes"
              @slideChangeTransitionEnd="notDestroyPanes"
              @afterInit="notDestroyPanes">
        <swiper-slide>
          <progress-tab></progress-tab>
        </swiper-slide>
        <swiper-slide>
          <planner-tab @lock-slide="lockSlide"
                       @unlock-slide="unlockSlide"
                       :destroy="destroy"
                       v-if="activeIndex === 1"
                       :tab="activeIndex === 1">
          </planner-tab>
        </swiper-slide>
        <swiper-slide>
          <tasks-tab @view-timer-parent="viewTimer"
                     v-if="activeIndex === 2"
                     :tab="activeIndex === 2">
          </tasks-tab>
        </swiper-slide>
        <swiper-slide>
          <timer-tab :task="data.task"></timer-tab>
        </swiper-slide>
        <swiper-slide>
          <settings-tab @lock-slide="lockSlide"
                        @unlock-slide="unlockSlide">
          </settings-tab>
        </swiper-slide>
      </swiper>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonContent, IonHeader, IonToolbar } from '@ionic/vue';
import { readerOutline, timerOutline, cogOutline, analyticsOutline, calendarNumberOutline } from 'ionicons/icons';
import TasksTab from "@/views/tabs/TasksTab.vue";
import PlannerTab from "@/views/tabs/PlannerTab.vue";
import TimerTab from "@/views/tabs/TimerTab.vue";
import ProgressTab from "@/views/tabs/ProgressTab.vue";
import SettingsTab from "@/views/tabs/SettingsTab.vue";
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from "swiper";
import { defineComponent, ref, reactive } from 'vue';
import 'swiper/css/pagination';

export default defineComponent( {
  name: "HomeView",
  data() {
    return {
      tabs: ["progress", "planner", "tasks", "timer", "settings"],
      activeIndex: 2,
      destroy: false
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
    destroyPanes() {
      this.destroy = true
    },

    notDestroyPanes() {
      this.destroy = false
    },

    onSlideChange(swiper) {
      this.activeIndex = swiper.activeIndex;
    }
  },
  setup() {
    const data = reactive({
      task: {}
    })

    const slides = ref();
    const setSwiperInstance = (swiper) => {
      slides.value = swiper;
      slides.value.slideTo(2, 0, false);
    }

    function handlePaginationClick(index) {
      slides.value.slideTo(index);
    }

    function viewTimer(task) {
      slides.value.slideTo(3);
      data.task = task
    }

    function lockSlide() {
      slides.value.allowTouchMove = false;
    }

    function unlockSlide() {
      slides.value.allowTouchMove = true;
    }

    return {
      modules: [Pagination],
      readerOutline,
      timerOutline,
      cogOutline,
      analyticsOutline,
      calendarNumberOutline,
      setSwiperInstance,
      slides,
      viewTimer,
      data,
      handlePaginationClick,
      lockSlide,
      unlockSlide
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