<template>
  <v-card rounded="lg">
    <!-- Toolbar with close button -->
    <v-toolbar color="warning" flat>
      <v-btn icon @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title class="text-white">
        {{ isEditing ? 'ویرایش اپلیکیشن' : 'افزودن اپلیکیشن' }}
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <!-- Form -->
      <v-form ref="formRef" v-model="formValidComputed">
        <!-- App Name -->
        <p class="my-2">نام اپلیکیشن</p>
        <v-text-field
          v-model="localForm.nameApp"
          autocomplete="off"
          density="comfortable"
          :rules="[required]"
          variant="outlined"
        />

        <!-- Password -->
        <p class="my-2">رمزعبور</p>
        <v-text-field
          v-model="localForm.password"
          density="comfortable"
          dir="ltr"
          :rules="[required, passwordCharRule]"
          :type="showPassword ? 'text' : 'password'"
          variant="outlined"
          @copy.prevent
          @cut.prevent
          @input="filterPassword"
          @paste.prevent
        >
          <template #prepend-inner>
            <v-icon
              @mousedown.prevent="$emit('toggle-password', true)"
              @mouseleave.prevent="$emit('toggle-password', false)"
              @mouseup.prevent="$emit('toggle-password', false)"
            >
              {{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}
            </v-icon>
          </template>
        </v-text-field>

        <!-- Website (optional) -->
        <p class="my-2">لینک وبسایت (اختیاری)</p>
        <v-text-field
          v-model="localForm.website"
          density="comfortable"
          dir="ltr"
          variant="outlined"
        />

        <!-- Description (optional) -->
        <p class="my-2">توضیحات (اختیاری)</p>
        <v-textarea v-model="localForm.description" auto-grow rows="1" variant="outlined" />
      </v-form>

      <!-- Submit Button -->
      <v-btn class="mt-4" color="primary" @click="$emit('submit')">
        {{ isEditing ? 'ویرایش' : 'افزودن' }}
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup>
// ============================
// Imports
// ============================
  import { computed, ref, watch } from 'vue'

  // ============================
  // Props
  // ============================
  const props = defineProps({
    form: Object,
    isEditing: Boolean,
    formValid: Boolean,
    showPassword: Boolean,
  })

  // ============================
  // Emits
  // ============================
  const emit = defineEmits(['update:form', 'update:formValid', 'close', 'submit', 'toggle-password'])

  // ============================
  // Refs
  // ============================
  const formRef = ref(null)

  // ============================
  // Local Form Copy
  // ============================
  const localForm = ref({ ...props.form })

  watch(localForm, v => emit('update:form', v), { deep: true })
  const formValidComputed = computed({
    get: () => props.formValid,
    set: value => emit('update:formValid', value),
  })
  const required = v => (v ? true : 'پر کردن فیلد الزامی است')
  function passwordCharRule (value) {
    return /[^A-Za-z0-9!@#$%^&*()_\-=\[\]{};':"\\|,.<>\/?]/.test(value)
      ? 'رمز عبور فقط حروف انگلیسی و اعداد باشد'
      : true
  }
  function filterPassword (e) {
    localForm.value.password = e.target.value.replace(
      /[^A-Za-z0-9!@#$%^&*()_\-=\[\]{};':"\\|,.<>\/?]/g,
      '',
    )
  }
  const validateForm = () => formRef.value.validate()
  defineExpose({
    validateForm,
  })
</script>
