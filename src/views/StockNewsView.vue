<template>
  <v-container>
    <h2 class="mb-6">뉴스 검색</h2>

    <v-row class="mb-4" align="center" justify="start" dense>
      <v-col cols="12" sm="4" md="3">
        <v-text-field
          v-model="searchSymbol"
          label="종목 심볼 입력 (예: AAPL)"
          outlined
          dense
          clearable
          @keyup.enter="fetchNews"
        />
      </v-col>

      <v-col cols="12" sm="4" md="3">
        <v-menu
          v-model="fromMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template #activator="{ props }">
            <v-text-field
              v-model="fromDate"
              label="From 날짜 (YYYY-MM-DD)"
              readonly
              v-bind="props"
              dense
              outlined
              clearable
            />
          </template>
          <v-date-picker
            v-model="fromDate"
            :max="toDate || undefined"
            @update:model-value="fromMenu = false"
            locale="en"
          />
        </v-menu>
      </v-col>

      <v-col cols="12" sm="4" md="3">
        <v-menu
          v-model="toMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template #activator="{ props }">
            <v-text-field
              v-model="toDate"
              label="To 날짜 (YYYY-MM-DD)"
              readonly
              v-bind="props"
              dense
              outlined
              clearable
            />
          </template>
          <v-date-picker
            v-model="toDate"
            :min="fromDate || undefined"
            :max="today"
            @update:model-value="toMenu = false"
            locale="en"
          />
        </v-menu>
      </v-col>

      <v-col cols="auto">
        <v-btn
          color="primary"
          @click="fetchNews"
          :loading="loading"
          :disabled="!searchSymbol || !fromDate || !toDate"
        >
          검색
        </v-btn>
      </v-col>
    </v-row>

    <v-alert v-if="errorMessage" type="error" class="mb-4">
      {{ errorMessage }}
    </v-alert>

    <v-row dense v-if="newsList.length > 0">
      <v-col
        v-for="news in newsList"
        :key="news.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="hoverable" :href="news.url" target="_blank" rel="noopener noreferrer">
          <v-img
            :src="news.image || defaultImage"
            height="180"
            cover
            alt="news image"
          />
          <v-card-title class="text-wrap" style="min-height: 60px;">
            {{ news.headline }}
          </v-card-title>
          <v-card-subtitle class="grey--text text--darken-1 mb-2" style="font-size: 0.9rem;">
            {{ news.source }} · {{ formatDate(news.datetime) }}
          </v-card-subtitle>
          <v-card-text class="text-wrap" style="height: 100px; overflow: hidden; text-overflow: ellipsis;">
            {{ news.summary || '요약 정보가 없습니다.' }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-alert v-else type="info" class="mt-6" border="left" colored-border>
      검색어와 날짜를 입력하고 검색 버튼을 눌러주세요.
    </v-alert>

    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      class="mx-auto mt-6"
    />
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const searchSymbol = ref('')
const newsList = ref([])
const errorMessage = ref('')
const loading = ref(false)
const defaultImage = 'https://via.placeholder.com/400x180?text=No+Image'

const fromMenu = ref(false)
const toMenu = ref(false)

const today = new Date().toISOString().substr(0, 10)
const fromDate = ref('')
const toDate = ref('')

function formatDate(ts) {
  if (!ts) return '-'
  const d = new Date(ts * 1000)
  return d.toLocaleString()
}

function toYYYYMMDD(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

async function fetchNews() {
  if (!searchSymbol.value) {
    errorMessage.value = '종목 심볼을 입력해주세요.'
    newsList.value = []
    return
  }
  if (!fromDate.value || !toDate.value) {
    errorMessage.value = '날짜를 모두 선택해주세요.'
    newsList.value = []
    return
  }
  if (fromDate.value > toDate.value) {
    errorMessage.value = '"From 날짜"는 "To 날짜"보다 이전이어야 합니다.'
    newsList.value = []
    return
  }

  loading.value = true
  errorMessage.value = ''
  newsList.value = []

  try {
    const res = await axios.get(`/api/stocks/${searchSymbol.value}/news`, {
      params: {
        from: toYYYYMMDD(fromDate.value),
        to: toYYYYMMDD(toDate.value),
      },
    })
    newsList.value = res.data
    if (newsList.value.length === 0) {
      errorMessage.value = '해당 조건에 맞는 뉴스가 없습니다.'
    }
  } catch (e) {
    errorMessage.value = '뉴스를 불러오는 데 실패했습니다.'
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.hoverable {
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}
.hoverable:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
.text-wrap {
  white-space: normal;
}
</style>
