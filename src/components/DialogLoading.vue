<template>
  <v-dialog v-model="dialog" persistent width="150px">
    <v-card class="pa-5 d-flex align-center">
      <v-progress-circular indeterminate :size="54" :width="5" />
      <p class="my-3">در حال پردازش</p>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { computed } from 'vue'
  import { useUIView } from '@/stores/ui' // make sure store ID is unique

  const ui = useUIView()

  const dialog = computed({
    get: () => ui.load,
    set: value => ui.setLoading(value),
  })
</script>
