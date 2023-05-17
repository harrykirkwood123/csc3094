import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
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
// Before each route transition:
router.beforeEach(async (to) => {
  // Check if the target route requires authentication.
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  // If it requires authentication and no user is currently logged in, redirect to '/login'.
  if (requiresAuth && !(await getCurrentUser())) {
    return '/login'
  }
  // Otherwise, proceed as normal.
})

export default router