import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

import useFirebaseAuth from "../hooks/firebase-auth";
const state = useFirebaseAuth();

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
  },
  // {
  //   path: '/signup',
  //   name: 'signup',
  //   component: () => import('@/views/auth/CreateUser.vue'),
  // }
  {
    path: '/tasks',
    name: 'Tasks',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '/tasks',
        name: 'tasks',
        component: () => import('@/views/tabs/TasksTab.vue'),
      },
      {
        path: '/progress',
        name: 'progress',
        component: () => import('@/views/tabs/ProgressTab.vue'),
      },
      {
        path: '/planner',
        name: 'planner',
        component: () => import('@/views/tabs/PlannerTab.vue'),
      },
      {
        path: '/settings',
        name: 'settings',
        component: () => import('@/views/tabs/SettingsTab.vue'),
      },
      {
        path: '/timer/:task/:duration',
        name: 'timer',
        component: () => import('@/views/tabs/TimerTab.vue'),
        props: true
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Used to check if a page requires authentication and routes the user accordingly depending on the auth state of
// the user.
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (state.user.value && !requiresAuth) {
    next({name : 'tasks', replace : true})
  } else if (!state.user.value && requiresAuth) {
    next({name : 'login', replace : true})
  } else {
    next();
  }
});

export default router
