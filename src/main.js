import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

// ✅ Vuetify 아이콘 폰트
import '@mdi/font/css/materialdesignicons.css'

// ✅ ApexCharts 전역 등록
import VueApexCharts from 'vue3-apexcharts'
import axios from './plugins/axios'

const app = createApp(App)

app.config.globalProperties.$axios = axios // 전역 사용 가능
app.use(router)
app.use(vuetify)
app.component('ApexChart', VueApexCharts) // ✅ 여기 추가됨
app.mount('#app')
