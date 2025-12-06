<template>
  <v-card class="my-2 sky-animated-card px-4" :class="isMobile ? 'mx-2' : 'mx-10'">
    <v-row class="align-center">
      <!-- App Name -->
      <v-col class="d-flex" cols="12" md="6">
        <p>نام اپلیکیشن:</p>
        <p class="mx-2">{{ data.nameApp }}</p>
      </v-col>

      <!-- Action Buttons -->
      <v-col
        class="d-flex"
        :class="isMobile ? 'justify-start mt-2' : 'justify-end'"
        cols="12"
        md="6"
      >
        <div :style="isMobile ? '' : 'position:absolute; top:20px'">
          <v-btn color="primary" icon="mdi-pencil" variant="outlined" @click="onEdit" />

          <v-btn
            class="mx-2"
            color="error"
            icon="mdi-delete"
            variant="outlined"
            @click="onDelete"
          />

          <v-btn
            v-if="data.website || data.description"
            :icon="data.showDetails ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            variant="text"
            @click="onToggleDetails"
          />
        </div>
      </v-col>

      <!-- Password -->
      <v-col cols="12">
        <div class="d-flex align-center flex-wrap">
          <p>رمزعبور:</p>
          <p class="mx-2 cursor-pointer">
            {{ isVisible ? data.password : '••••••••' }}
          </p>
          <p
            class="mx-5 sky-show-password py-1 px-3 cursor-pointer"
            :class="isMobile ? 'text-caption' : ''"
            @click="onTogglePassword"
          >
            {{ isVisible ? 'عدم نمایش' : 'نمایش' }}
          </p>
        </div>
      </v-col>

      <!-- App Details -->
      <v-expand-transition>
        <div v-if="data.showDetails">
          <v-col v-if="data.website" class="d-flex" cols="12">
            <p>لینک وبسایت:</p>
            <p class="mx-2">{{ data.website }}</p>
          </v-col>

          <v-col v-if="data.description" class="d-flex" cols="12">
            <p>توضیحات:</p>
            <p class="mx-2">{{ data.description }}</p>
          </v-col>
        </div>
      </v-expand-transition>
    </v-row>
  </v-card>
</template>

<script setup>
// ============================
// Imports
// ============================
  import { computed } from 'vue'
  import { useDisplay } from 'vuetify'

  // ============================
  // Props
  // ============================
  const props = defineProps({
    data: { type: Object, required: true },
    visiblePasswordIndex: { type: [String, Number, null], default: null },
  })

  // ============================
  // Emits
  // ============================
  const emit = defineEmits(['edit', 'delete', 'toggle-details', 'toggle-password'])

  const { smAndDown } = useDisplay()
  const isMobile = computed(() => smAndDown.value)
  const isVisible = computed(() => props.visiblePasswordIndex === props.data.id)
  const onEdit = () => emit('edit', props.data)
  const onDelete = () => emit('delete', props.data)
  const onToggleDetails = () => emit('toggle-details', props.data)
  const onTogglePassword = () => emit('toggle-password', props.data)
</script>

<style scoped>
.sky-animated-card {
  position: relative;
  padding: 16px;
  border-radius: 14px;
  border: 2px solid #b3e5fc;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(10px);
  animation: fadeSlideUp 0.4s ease forwards;
}
.sky-animated-card:hover {
  transform: translateY(-4px) scale(1.015);
  box-shadow: 0 2px 3px rgba(179, 229, 252, 0.5);
  border-color: #81d4fa;
}
.sky-show-password {
  border-radius: 14px;
  border: 2px solid #b3e5fc;
  transition: all 0.3s ease;
}
</style>
