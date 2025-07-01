import { createRouter, createWebHistory } from 'vue-router'
import TopStocksView from '../views/TopStocksView.vue'
import StockDetailView from '../views/StockDetailView.vue'
import StockNewsView from '../views/StockNewsView.vue'  // 추가

const routes = [
    { path: '/', redirect: '/top-stocks' },
    { path: '/top-stocks', component: TopStocksView },
    { path: '/stocks/:symbol', name: 'StockDetail', component: StockDetailView },
    { path: '/news', name: 'NeStockNewsws', component: StockNewsView },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
