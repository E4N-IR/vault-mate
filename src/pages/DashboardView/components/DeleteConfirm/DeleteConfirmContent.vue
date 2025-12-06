<template>
  <v-card rounded="lg">
    <v-toolbar color="error" flat>
      <v-btn icon @click="$emit('cancel')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title class="text-white">حذف</v-toolbar-title>
    </v-toolbar>

    <v-card-text class="text-center">
      <p>آیا از حذف {{ name }} مطمئن هستید؟</p>
    </v-card-text>

    <v-card-actions>
      <v-row class="d-flex ga-5 px-5 mt-8" no-gutters>
        <v-col class="d-flex">
          <v-btn color="primary" variant="outlined" width="100%" @click="$emit('cancel')">
            انصراف
          </v-btn>
        </v-col>
        <v-col class="d-flex">
          <v-btn color="error" variant="outlined" width="100%" @click="$emit('confirm')">
            حذف
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script setup>
  defineProps({
    name: String,
  })

  defineEmits(['cancel', 'confirm'])
</script>
