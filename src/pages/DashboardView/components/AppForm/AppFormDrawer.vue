<template>
  <!-- Mobile drawer -->
  <v-navigation-drawer
    v-if="isMobile"
    v-model="dialogComputed"
    :class="dialogComputed ? 'navigation-style' : ''"
    location="bottom"
    temporary
  >
    <AppFormContent
      ref="formContentRef"
      v-model:form-valid="formValidComputed"
      :form="form"
      :is-editing="isEditing"
      :show-password="showPassword"
      @close="closeForm"
      @submit="submit"
      @toggle-password="togglePassword"
      @update:form="emitForm"
    />
  </v-navigation-drawer>

  <!-- Desktop dialog -->
  <v-dialog
    v-else
    v-model="dialogComputed"
    content-class="desktop-dialog"
    height="40rem"
    max-width="500"
  >
    <AppFormContent
      ref="formContentRef"
      v-model:form-valid="formValidComputed"
      :form="form"
      :is-editing="isEditing"
      :show-password="showPassword"
      @close="closeForm"
      @submit="submit"
      @toggle-password="togglePassword"
      @update:form="emitForm"
    />
  </v-dialog>
</template>

<script setup>
// ============================
// Imports
// ============================
  import { computed, ref } from 'vue'
  import { useDisplay } from 'vuetify'
  import AppFormContent from './AppFormContent.vue'

  // ============================
  // Props
  // ============================
  const props = defineProps({
    modelValue: Boolean,
    form: Object,
    isEditing: Boolean,
    formValid: Boolean,
    showPassword: Boolean,
  })

  // ============================
  // Emits
  // ============================
  const emit = defineEmits([
    'update:modelValue',
    'update:form',
    'update:formValid',
    'submit',
    'toggle-password',
  ])

  // ============================
  // Refs
  // ============================
  const formContentRef = ref(null)

  // Computed for two-way binding of dialog
  const dialogComputed = computed({
    get: () => props.modelValue,
    set: v => emit('update:modelValue', v),
  })

  // Writable computed for form validation
  const formValidComputed = computed({
    get: () => props.formValid,
    set: val => emit('update:formValid', val),
  })

  // Detect mobile layout
  const { smAndDown } = useDisplay()
  const isMobile = computed(() => smAndDown.value)

  // Close drawer/dialog
  const closeForm = () => emit('update:modelValue', false)

  // Emit updated form data
  const emitForm = val => emit('update:form', val)

  // Trigger submit
  const submit = () => emit('submit')

  // Toggle password visibility
  const togglePassword = v => emit('toggle-password', v)

  // Expose validateForm method for parent access
  defineExpose({
    validateForm: () => formContentRef.value?.validateForm(),
  })
</script>
<style scoped>
.navigation-style {
  height: 600px !important;
}
</style>
