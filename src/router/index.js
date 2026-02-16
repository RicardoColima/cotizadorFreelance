import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
      meta: { guest: true }
    },
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/quotes',
      name: 'quotes-list',
      component: () => import('../views/QuotesList.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/quotes/new',
      name: 'create-quote',
      component: () => import('../views/CreateQuote.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/quotes/:id/edit',
      name: 'edit-quote',
      component: () => import('../views/CreateQuote.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/quotes/:id',
      name: 'quote-preview',
      component: () => import('../views/QuotePreview.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/templates',
      name: 'templates',
      component: () => import('../views/Templates.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next('/login')
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (isAuthenticated) {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
