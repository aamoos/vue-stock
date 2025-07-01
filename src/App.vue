<template>
  <v-app>
    <v-main>
      <v-container>
        <v-btn to="/" variant="outlined" class="mr-2">인기랭킹</v-btn>
        <v-btn to="/news" variant="outlined" class="mr-2">뉴스</v-btn>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
</script>
