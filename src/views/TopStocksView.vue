<template>
  <v-container>
    <h1 class="mb-4">🔥 미국 인기 주식 Top {{ selectedCount }}</h1>

    <!-- 🔍 검색창 + 버튼 + 콤보박스 -->
    <v-form @submit.prevent="searchStock">
      <v-row class="mb-4" align="center" justify="start">
        <!-- 검색창 -->
        <v-col cols="12" sm="5" md="4">
          <v-text-field
            v-model="searchSymbol"
            label="주식 티커 입력 (예: AAPL)"
            outlined
            dense
            hide-details
          />
        </v-col>

        <!-- 검색 버튼 -->
        <v-col cols="6" sm="3" md="2">
          <v-btn
            color="primary"
            type="submit"
            block
            class="mt-sm-0"
          >
            🔍 검색
          </v-btn>
        </v-col>

        <!-- Top 콤보박스 -->
        <v-col cols="6" sm="4" md="3">
          <v-select
            v-model="selectedCount"
            :items="[10, 20, 50, 100]"
            label="Top N 선택"
            outlined
            dense
            hide-details
          />
        </v-col>
      </v-row>
    </v-form>

    <!-- ⚠ 오류 메시지 -->
    <v-alert v-if="errorMessage" type="error" class="mb-4">
      {{ errorMessage }}
    </v-alert>

    <!-- 📋 주식 목록 -->
    <v-row>
      <v-col
        v-for="stock in stocks"
        :key="stock.symbol"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card
          :to="`/stocks/${stock.symbol}`"
          elevation="2"
          class="pa-3"
          hover
          ripple
        >
          <v-card-title class="text-h6">{{ stock.name }}</v-card-title>
          <v-card-subtitle>{{ stock.symbol }}</v-card-subtitle>
          <v-card-text>
            <div>📈 가격: ${{ stock.price.toFixed(2) }}</div>
            <div :class="stock.change >= 0 ? 'text-success' : 'text-error'">
              {{ stock.change >= 0 ? '▲' : '▼' }} {{ stock.change }}%
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script setup>
import { ref, watch, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchSymbol = ref('')
const stocks = ref([])
const selectedCount = ref(20)  // ✅ 기본 Top 20
const errorMessage = ref('')

// 🔍 검색
function searchStock() {
  if (searchSymbol.value.trim()) {
    const symbol = searchSymbol.value.trim().toUpperCase()
    router.push(`/stocks/${symbol}`)
  }
}

// ✅ 전역 axios 사용
const { appContext } = getCurrentInstance()
const axios = appContext.config.globalProperties.$axios

// 📥 데이터 불러오기
async function loadStocks() {
  try {
    errorMessage.value = ''
    const res = await axios.get(`/stocks/top?count=${selectedCount.value}`)
    const quotes = res.data.finance.result[0].quotes

    stocks.value = quotes.map(q => ({
      name: q.shortName || q.longName || q.symbol,
      symbol: q.symbol,
      price: q.regularMarketPrice,
      change: q.regularMarketChangePercent?.toFixed(2) || 0,
    }))
  } catch (err) {
    console.error('📉 주식 데이터 로딩 실패:', err)
    errorMessage.value = '주식 데이터를 불러오는 데 실패했습니다.'
  }
}

// 🔁 Top N 변경 시 자동 호출
watch(selectedCount, loadStocks)
onMounted(loadStocks)
</script>
