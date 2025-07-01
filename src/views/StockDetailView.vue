<template>
  <v-container>
    <h2 class="mb-4">{{ symbol }} 주가 상세 차트 & 재무제표</h2>

    <v-row align="center" class="mb-4">
      <v-col cols="6" sm="3">
        <v-select
          v-model="range"
          :items="allowedRanges"
          label="기간 선택"
          dense
          outlined
        />
      </v-col>
      <v-col cols="6" sm="3">
        <v-select
          v-model="interval"
          :items="allowedIntervals"
          label="간격 선택"
          dense
          outlined
        />
      </v-col>
    </v-row>

    <ApexChart
      type="line"
      height="350"
      :options="chartOptions"
      :series="series"
    />

    <v-card class="mt-6" outlined>
      <v-card-title>손익계산서 (최근 데이터)</v-card-title>
      <v-data-table
        :columns="columns"
        :items="incomeStatements"
        dense
        hide-default-footer
        class="elevation-1"
      >
        <template #item.date="{ item }">
          <span class="font-weight-medium">{{ item.date }}</span>
        </template>
        <template #item.revenue="{ item }">
          {{ formatNumber(item.revenue) }}
        </template>
        <template #item.operatingIncome="{ item }">
          {{ formatNumber(item.operatingIncome) }}
        </template>
        <template #item.netIncome="{ item }">
          {{ formatNumber(item.netIncome) }}
        </template>
        <template #item.eps="{ item }">
          {{ item.eps?.toFixed(2) ?? '-' }}
        </template>
        <template #item.finalLink="{ item }">
          <v-btn
            small
            text
            color="primary"
            :href="item.finalLink"
            target="_blank"
            rel="noopener noreferrer"
          >
            SEC 보고서
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const symbol = route.params.symbol

const allRanges = ['1d', '5d', '1mo', '3mo', '1y']
const allIntervals = ['1m', '5m', '15m', '1d']
const range = ref('1mo')
const interval = ref('1d')

const allowedRanges = computed(() => {
  if (interval.value === '1m') return ['1d', '5d']
  else if (interval.value === '5m' || interval.value === '15m') return ['5d', '1mo', '3mo']
  else if (interval.value === '1d') return allRanges
  return allRanges
})

const allowedIntervals = computed(() => {
  if (range.value === '1d' || range.value === '5d') return ['1m', '5m', '15m', '1d']
  else if (range.value === '1mo' || range.value === '3mo') return ['5m', '15m', '1d']
  else if (range.value === '1y') return ['1d']
  return allIntervals
})

const series = ref([{ name: symbol, data: [] }])
const chartOptions = ref({
  chart: { type: 'line', zoom: { enabled: false } },
  xaxis: { categories: [] },
  title: { text: `${symbol} 실시간 차트`, align: 'left' },
})

const incomeStatements = ref([])

// Vuetify 3 기준 컬럼 정의
const columns = [
  { title: '연도 (Date)', key: 'date', width: '120px' },
  { title: '매출 (Revenue)', key: 'revenue', align: 'end' },
  { title: '영업이익 (Operating Income)', key: 'operatingIncome', align: 'end' },
  { title: '순이익 (Net Income)', key: 'netIncome', align: 'end' },
  { title: 'EPS', key: 'eps', align: 'end', width: '80px' },
  { title: '보고서 링크', key: 'finalLink', align: 'center', width: '130px' },
]

function formatNumber(num) {
  if (num === null || num === undefined) return '-'
  return Number(num).toLocaleString()
}

async function fetchChart() {
  try {
    const res = await axios.get(`/api/stocks/${symbol}/chart`, {
      params: { range: range.value, interval: interval.value },
    })

    const result = res.data.chart.result[0]
    const timestamps = result.timestamp
    const prices = result.indicators.quote[0].close

    const labels = timestamps.map(ts => {
      const d = new Date(ts * 1000)
      if (interval.value.includes('m')) {
        return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
      } else {
        return `${d.getMonth() + 1}/${d.getDate()}`
      }
    })

    series.value[0].data = prices
    chartOptions.value.xaxis.categories = labels
  } catch (error) {
    console.error('차트 데이터 로딩 실패:', error)
  }
}

async function fetchIncomeStatement() {
  try {
    const res = await axios.get(`/api/stocks/${symbol}/income-statement`)
    incomeStatements.value = res.data
  } catch (error) {
    console.error('재무제표 데이터 로딩 실패:', error)
    incomeStatements.value = []
  }
}

onMounted(() => {
  fetchChart()
  fetchIncomeStatement()
})

watch([range, interval], fetchChart)
</script>
