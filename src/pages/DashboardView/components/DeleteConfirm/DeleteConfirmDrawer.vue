<template>
  <!-- Mobile drawer -->
  <v-navigation-drawer
    v-if="isMobile"
    v-model="dialogComputed"
    location="bottom"
    temporary
    width="260"
  >
    <DeleteConfirmContent :name="name" @cancel="close" @confirm="confirm" />
  </v-navigation-drawer>

  <!-- Desktop dialog -->
  <v-dialog
    v-else
    v-model="dialogComputed"
    content-class="desktop-dialog"
    height="250px"
    max-width="500"
  >
    <DeleteConfirmContent :name="name" @cancel="close" @confirm="confirm" />
  </v-dialog>
</template>

<script setup>
// ============================
// Imports
// ============================
  import { computed } from 'vue'
  import { useDisplay } from 'vuetify'
  import DeleteConfirmContent from './DeleteConfirmContent.vue'

  // ============================
  // Props
  // ============================
  const props = defineProps({
    modelValue: Boolean, // v-model for dialog visibility
    name: String, // name of the item to delete
  })

  // ============================
  // Emits
  // ============================
  const emit = defineEmits(['update:modelValue', 'confirm-delete'])

  // ============================
  // Computed
  // ============================

  // Computed property for two-way binding of the dialog
  const dialogComputed = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
  })

  // Detect mobile layout
  const { smAndDown } = useDisplay()
  const isMobile = computed(() => smAndDown.value)

  // ============================
  // Methods
  // ============================

  // Close the drawer/dialog
  const close = () => emit('update:modelValue', false)

  // Confirm deletion
  const confirm = () => emit('confirm-delete')
</script>
