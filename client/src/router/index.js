import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import VotingDetail from '@/views/VotingDetails.vue' // Импортируем компонент VotingDetail
import Admin from '@/views/Admin.vue' // Импортируем компонент Admin

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/votings',
    name: 'Votings',
    component: () => import('@/views/Votings.vue')
  },
  {
    path: '/voting/:id',  // Добавляем маршрут для VotingDetail
    name: 'VotingDetail',
    component: VotingDetail,
    props: true // Позволяет передавать параметры маршрута как props в компонент
  },
  {
    path: '/admin', // Маршрут для административной панели
    name: 'Admin',
    component: Admin // Компонент административной панели
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router