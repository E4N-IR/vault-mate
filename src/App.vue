<template>
  <v-app>
    <v-locale-provider :locale="locale" :rtl="true">
      <router-view />
      <DialogLoading />
    </v-locale-provider>
  </v-app>
</template>

<script setup>
  import { ref } from 'vue'
  import DialogLoading from './components/DialogLoading.vue'

  const locale = ref('fa')
</script>

<style>
@font-face {
  font-family: 'IranSans';
  src: url('@/assets/fonts/IRANSansBold-Edit.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
}

html,
body,
#app {
  font-family: 'IranSans', sans-serif;
}
</style>
