import { createRouter, createWebHistory } from 'vue-router'
import TopStocksView from '../views/TopStocksView.vue'
import StockDetailView from '../views/StockDetailView.vue'

const routes = [
    { path: '/', redirect: '/top-stocks' },
    { path: '/top-stocks', component: TopStocksView },
    { path: '/stocks/:symbol', name: 'StockDetail', component: StockDetailView },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
