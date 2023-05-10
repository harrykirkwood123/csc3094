import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
// import { getCurrentUser } from '@/hooks/firebase-auth'
import api from "@/api/api";

const { getCurrentUser } = api();

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
    name: 'tasks',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Used to check if a page requires authentication and routes the user accordingly depending on the auth state of
// the user.
// router.beforeEach((to, from, next) => {
//   const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
//   if (state.user.value && !requiresAuth) {
//     next({name : 'tasks', replace : true})
//   } else if (!state.user.value && requiresAuth) {
//     next({name : 'login', replace : true})
//   } else {
//     next();
//   }
// });

router.beforeEach(async (to) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  if (requiresAuth && !(await getCurrentUser())) {
    return '/login'
  }
})

export default router
