import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Импортируем роутер

const app = createApp(App)

app.use(router) // Подключаем роутер

app.mount('#app')